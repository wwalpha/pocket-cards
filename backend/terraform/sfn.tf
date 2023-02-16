# ---------------------------------------------------------------------------------------------
# AWS State Machine
# ---------------------------------------------------------------------------------------------
resource "aws_sfn_state_machine" "this" {
  name     = "${local.project_name}-batchflow"
  role_arn = aws_iam_role.sfn.arn

  logging_configuration {
    level                  = "ERROR"
    include_execution_data = true
    log_destination        = "${aws_cloudwatch_log_group.sfn.arn}:*"
  }

  definition = <<EOF
{
  "Comment": "Batch workflow",
  "StartAt": "ExportTableToS3",
  "States": {
    "ExportTableToS3": {
      "Type": "Task",
      "Parameters": {
        "S3Bucket.$": "$.S3Bucket",
        "TableArn.$": "$.TableArn",
        "ExportFormat": "ION"
      },
      "Resource": "arn:aws:states:::aws-sdk:dynamodb:exportTableToPointInTime",
      "ResultSelector": {
        "ExportArn.$": "$.ExportDescription.ExportArn",
        "S3Prefix.$": "States.ArrayGetItem(States.StringSplit($.ExportDescription.ExportArn, '/'), 3)"
      },
      "Next": "AfterStartExportTable",
      "ResultPath": "$.TaskResult"
    },
    "AfterStartExportTable": {
      "Type": "Parallel",
      "Branches": [
        {
          "StartAt": "DropTable",
          "States": {
            "DropTable": {
              "Type": "Task",
              "Resource": "arn:aws:states:::athena:startQueryExecution.sync",
              "Parameters": {
                "QueryString.$": "States.Format('DROP TABLE IF EXISTS `{}.learningtrace`', $.AthenaDB)",
                "WorkGroup.$": "$.AthenaWG"
              },
              "ResultPath": null,
              "Next": "CreateTable"
            },
            "CreateTable": {
              "Type": "Task",
              "Resource": "arn:aws:states:::athena:startQueryExecution.sync",
              "Parameters": {
                "QueryString.$": "States.Format('CREATE EXTERNAL TABLE IF NOT EXISTS `{}.learningtrace`(`item` struct<qid:string,`timestamp`:string,groupid:string,lasttime:string,subject:string,timesafter:decimal(38,18),timesbefore:decimal(38,18),userid:string>) ROW FORMAT SERDE \\'com.amazon.ionhiveserde.IonHiveSerDe\\' WITH SERDEPROPERTIES (\\'ion.encoding\\'=\\'BINARY\\', \\'ion.fail_on_overflow\\'=\\'true\\', \\'ion.ignore_malformed\\'=\\'false\\', \\'ion.path_extractor.case_sensitive\\'=\\'false\\',\\'ion.serialize_null\\'=\\'OMIT\\',\\'ion.timestamp.serialization_offset\\'=\\'Z\\') STORED AS INPUTFORMAT \\'com.amazon.ionhiveserde.formats.IonInputFormat\\' OUTPUTFORMAT \\'com.amazon.ionhiveserde.formats.IonOutputFormat\\' LOCATION \\'s3://{}/AWSDynamoDB/{}/data/\\'', $.AthenaDB, $.S3Bucket, $.TaskResult.S3Prefix)",
                "WorkGroup.$": "$.AthenaWG"
              },
              "ResultPath": null,
              "End": true
            }
          }
        },
        {
          "StartAt": "Wait",
          "States": {
            "Wait": {
              "Type": "Wait",
              "Seconds": 60,
              "Next": "DescribeExport"
            },
            "DescribeExport": {
              "Type": "Task",
              "Parameters": {
                "ExportArn.$": "$.TaskResult.ExportArn"
              },
              "Resource": "arn:aws:states:::aws-sdk:dynamodb:describeExport",
              "ResultSelector": {
                "ExportStatus.$": "$.ExportDescription.ExportStatus",
                "TaskResult": {
                  "ExportArn.$": "$.ExportDescription.ExportArn"
                }
              },
              "Next": "CheckExportStatus"
            },
            "CheckExportStatus": {
              "Type": "Choice",
              "Choices": [
                {
                  "Variable": "$.ExportStatus",
                  "StringEquals": "FAILED",
                  "Next": "ExportFailed"
                },
                {
                  "Variable": "$.ExportStatus",
                  "StringEquals": "IN_PROGRESS",
                  "Next": "Wait"
                }
              ],
              "Default": "ExportSuccess"
            },
            "ExportFailed": {
              "Type": "Fail"
            },
            "ExportSuccess": {
              "Type": "Succeed"
            }
          }
        }
      ],
      "Next": "Lambda Invoke"
    },
    "Lambda Invoke": {
      "Type": "Task",
      "Resource": "arn:aws:states:::lambda:invoke",
      "OutputPath": "$.Payload",
      "Parameters": {
        "FunctionName": "${aws_lambda_function.batch.arn}:$LATEST"
      },
      "Retry": [
        {
          "ErrorEquals": [
            "Lambda.ServiceException",
            "Lambda.AWSLambdaException",
            "Lambda.SdkClientException",
            "Lambda.TooManyRequestsException"
          ],
          "IntervalSeconds": 2,
          "MaxAttempts": 6,
          "BackoffRate": 2
        }
      ],
      "Next": "Success"
    },
    "Success": {
      "Type": "Succeed"
    }
  }
}
EOF
}
