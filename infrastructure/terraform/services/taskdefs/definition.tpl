[
  {
    "name": "${container_name}",
    "image": "${container_image}",
    "essential": true,
    "environmentFiles": [
      {
        "value": "${env_file_arn}",
        "type": "s3"
      }
    ],
    "portMappings": [
      {
        "containerPort": ${container_port},
        "protocol": "tcp"
      }
    ],
    "healthCheck": {
        "command": [
          "CMD-SHELL, curl -f http://localhost:8080/v1/health || exit 1"
        ]
    },
    "logConfiguration": {
      "logDriver": "awslogs",
      "secretOptions": null,
      "options": {
        "awslogs-create-group": "true",
        "awslogs-group": "/ecs/${container_name}",
        "awslogs-region": "${aws_region}",
        "awslogs-stream-prefix": "ecs"
      }
    }
  }
]
