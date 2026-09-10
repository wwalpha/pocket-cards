require 'json'
require 'open3'
require 'tmpdir'

# Run with: ruby --disable-gems .github/tests/bootstrap_lambda_images_test.rb
script = File.expand_path('../../infrastructure/terraform/setup/scripts/bootstrap_lambda_images.sh', __dir__)
registry = '123456789012.dkr.ecr.ap-northeast-1.amazonaws.com'
digest = "sha256:#{'a' * 64}"
repositories = %w[batch backend-lambda auth-lambda users-lambda]
initial = {
  'registry' => registry, 'digest' => digest, 'images' => [], 'commands' => [],
  'parameters' => repositories.to_h { |repo| ["/images/#{repo}", "#{registry}/pkc/#{repo}:#{repo == 'batch' ? 'bootstrap' : 'latest'}"] }
}

Dir.mktmpdir('lambda-bootstrap-test') do |dir|
  stub = File.join(dir, 'stub')
  File.write(stub, <<~'RUBY')
    #!/usr/bin/ruby --disable-gems
    require 'json'
    STDIN.read if File.basename($0) == 'docker' && ARGV.first == 'login'
    file = ENV.fetch('BOOTSTRAP_TEST_STATE')
    state = JSON.parse(File.read(file))
    command = [File.basename($0), *ARGV]
    state['commands'] << command
    value = ->(name) { ARGV.fetch(ARGV.index(name) + 1) }
    save = -> { File.write(file, JSON.generate(state)) }
    fail_with = ->(message) { save.call; warn message; exit 1 }
    case command[0]
    when 'terraform'
      key = ARGV.last
      repo = key.sub(/\A(?:ssm_)?repo_url_/, '').tr('_', '-')
      puts key.start_with?('ssm_') ? "/images/#{repo}" : "#{state['registry']}/pkc/#{repo}"
    when 'aws'
      case ARGV.take(2)
      when ['ssm', 'get-parameter']
        puts state['parameters'].fetch(value.call('--name'))
      when ['ssm', 'put-parameter']
        state['parameters'][value.call('--name')] = value.call('--value')
      when ['ecr', 'describe-images']
        fail_with.call('An error occurred (AccessDeniedException)') if state['deny_ecr']
        key = "#{value.call('--repository-name')}|#{value.call('--image-ids')}"
        fail_with.call('An error occurred (ImageNotFoundException)') unless state['images'].include?(key)
        puts ARGV.include?('--query') ? state['digest'] : '{}'
      when ['ecr', 'get-login-password']
        puts 'test-password'
      else
        fail_with.call("Unexpected AWS command: #{ARGV}")
      end
    when 'docker'
      case ARGV.first
      when 'login'
        nil
      when 'push'
        fail_with.call('Docker push failed') if state['fail_push']
        repo = ARGV.last.delete_prefix("#{state['registry']}/").delete_suffix(':bootstrap')
        state['images'] += ["#{repo}|imageTag=bootstrap", "#{repo}|imageDigest=#{state['digest']}"]
        if state['publish_during_push']
          state['parameters']["/images/#{repo.delete_prefix('pkc/')}"] = "#{state['registry']}/#{repo}:new-application"
        end
      when 'build', 'tag'
      else
        fail_with.call("Unexpected Docker command: #{ARGV}")
      end
    end
    save.call
  RUBY
  File.chmod(0755, stub)
  %w[terraform aws docker].each { |command| File.symlink(stub, File.join(dir, command)) }
  state_file = File.join(dir, 'state.json')
  env = { 'PATH' => "#{dir}:#{ENV.fetch('PATH')}", 'AWS_REGION' => 'ap-northeast-1',
          'AWS_ACCOUNT_ID' => '123456789012', 'BOOTSTRAP_TEST_STATE' => state_file }
  run = lambda do |state, success|
    File.write(state_file, JSON.generate(state))
    stdout, stderr, status = Open3.capture3(env, 'bash', script)
    raise "Unexpected result: #{stdout}\n#{stderr}" unless status.success? == success
    JSON.parse(File.read(state_file))
  end
  count = ->(state, *prefix) { state['commands'].count { |command| command.take(prefix.size) == prefix } }
  existing = Marshal.load(Marshal.dump(initial))
  repositories.each do |repo|
    existing['parameters']["/images/#{repo}"] = "#{registry}/pkc/#{repo}@#{digest}"
    existing['images'] << "pkc/#{repo}|imageDigest=#{digest}"
  end
  existing['parameters']['/images/batch'] = "#{registry}/pkc/batch:real-commit"
  existing['images'] << 'pkc/batch|imageTag=real-commit'

  fresh = run.call(initial, true)
  raise 'Must build once and upload all four defaults' unless count.call(fresh, 'docker', 'build') == 1 && count.call(fresh, 'docker', 'push') == 4
  raise 'Must publish image digests' unless repositories.all? { |repo| fresh['parameters']["/images/#{repo}"] == "#{registry}/pkc/#{repo}@#{digest}" }
  fresh['commands'] = []
  repeated = run.call(fresh, true)
  raise 'Repeated setup changed images' unless count.call(repeated, 'docker').zero? && count.call(repeated, 'aws', 'ssm', 'put-parameter').zero?

  kept = run.call(existing, true)
  raise 'Existing tag or digest was replaced' unless kept['parameters'] == existing['parameters'] && count.call(kept, 'docker').zero?

  stale = Marshal.load(Marshal.dump(existing))
  stale['parameters']['/images/batch'] = "#{registry}/pkc/batch:missing-commit"
  repaired = run.call(stale, true)
  raise 'Missing commit must get a separate default' unless count.call(repaired, 'docker', 'push') == 1 && repaired['commands'].include?(['docker', 'push', "#{registry}/pkc/batch:bootstrap"])
  raise 'Batch SSM was not repaired' unless repaired['parameters']['/images/batch'] == "#{registry}/pkc/batch@#{digest}"

  [{'deny_ecr' => true}, {'fail_push' => true}].each do |failure|
    failed = run.call(initial.merge(failure), false)
    raise 'Failure changed SSM' unless count.call(failed, 'aws', 'ssm', 'put-parameter').zero?
  end
  changed = run.call(stale.merge('publish_during_push' => true), true)
  raise 'Concurrent application publication was overwritten' unless changed['parameters']['/images/batch'].end_with?(':new-application') && count.call(changed, 'aws', 'ssm', 'put-parameter').zero?
  wrong_account = run.call(initial.merge('registry' => '999999999999.dkr.ecr.ap-northeast-1.amazonaws.com'), false)
  raise 'Unexpected registry was used' unless count.call(wrong_account, 'aws').zero? && count.call(wrong_account, 'docker').zero?
end

puts 'PASS: first setup, repeated setup, existing images, missing commit, AWS/push failures, concurrent publication and account validation'
