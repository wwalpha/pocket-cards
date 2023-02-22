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
    magnetic_store_retention_period_in_days = 1
  }
}


