require 'yaml'
require 'open3'

# Run with: ruby --disable-gems .github/tests/oidc_validation_test.rb
variables = %w[AWS_ROLE_ARN AWS_REGION AWS_ACCOUNT_ID]
configured = variables.to_h { |variable| [variable, "test-value-#{variable}"] }
checked = 0

Dir[File.expand_path('../workflows/*.yml', __dir__)].sort.each do |file|
  workflow = YAML.load_file(file)
  workflow.fetch('jobs').each do |job_id, job|
    steps = job.fetch('steps', [])
    steps.each_with_index do |step, index|
      next unless step.fetch('uses', '').start_with?('aws-actions/configure-aws-credentials@')

      label = "#{File.basename(file)}:#{job_id}"
      validation = index.positive? ? steps[index - 1] : {}
      raise "#{label}: missing validation" unless validation['name'] == 'Validate AWS environment variables'
      raise "#{label}: changed condition" unless validation['if'] == step['if']
      raise "#{label}: bash required" unless validation['shell'] == 'bash'
      expected_env = variables.to_h { |variable| [variable, "${{ vars.#{variable} }}"] }
      raise "#{label}: incorrect variables" unless validation['env'] == expected_env

      # Exercise the actual workflow script, including each empty and unset input.
      cases = [[configured, nil]]
      variables.each do |variable|
        ['', nil].each { |value| cases << [configured.merge(variable => value), variable] }
      end
      cases.each do |env, missing|
        stdout, stderr, status = Open3.capture3(
          env, 'bash', '--noprofile', '--norc', '-e', '-o', 'pipefail', '-c', validation.fetch('run')
        )
        expected_output = missing ? "::error::GitHub Environment variable #{missing} is not configured\n" : ''
        raise "#{label}: incorrect exit for #{missing || 'configured inputs'}" unless status.success? == missing.nil?
        raise "#{label}: unexpected output or leaked values" unless stdout == expected_output && stderr.empty?
      end
      checked += 1
    end
  end
end

raise 'No OIDC steps found' if checked.zero?
puts "PASS: #{checked} OIDC validations; configured, empty and unset inputs; no values logged"
