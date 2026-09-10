FROM public.ecr.aws/lambda/nodejs:24

RUN printf '%s\n' 'exports.handler = async () => { throw new Error("Application image has not been deployed yet"); };' > "${LAMBDA_TASK_ROOT}/index.js"

CMD ["index.handler"]
