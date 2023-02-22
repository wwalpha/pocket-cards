# ----------------------------------------------------------------------------------------------
# AWS TimeStream Database
# ----------------------------------------------------------------------------------------------
resource "aws_timestreamwrite_database" "this" {
  database_name = local.timestream_database
}

# ----------------------------------------------------------------------------------------------
# AWS TimeStream
# ----------------------------------------------------------------------------------------------
resource "aws_timestreamwrite_table" "traces" {
  database_name = aws_timestreamwrite_database.this.database_name
  table_name    = local.timestream_table_traces

  retention_properties {
    memory_store_retention_period_in_hours  = 1
    magnetic_store_retention_period_in_days = 3650
  }

  magnetic_store_write_properties {
    enable_magnetic_store_writes = true
    magnetic_store_rejected_data_location {
      s3_configuration {
        bucket_name       = aws_s3_bucket.archive.bucket
        encryption_option = "SSE_S3"
      }
    }
  }
}


