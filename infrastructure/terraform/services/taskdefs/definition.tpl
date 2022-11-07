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
  },
  {
    "name": "ecs-exporter",
    "image": "quay.io/prometheuscommunity/ecs-exporter:latest",
    "essential": true,
    "portMappings": [
      {
        "hostPort": 9779,
        "protocol": "tcp",
        "containerPort": 9779
      }
    ],
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
