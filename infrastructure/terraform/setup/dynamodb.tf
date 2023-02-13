# ----------------------------------------------------------------------------------------------
# Dynamodb Random Id
# ----------------------------------------------------------------------------------------------
resource "random_id" "dynamodb" {
  byte_length = 3
  prefix      = "_"
}

# ----------------------------------------------------------------------------------------------
# Dynamodb Table - Users
# ----------------------------------------------------------------------------------------------
resource "aws_dynamodb_table" "users" {
  name         = local.dynamodb_name_users
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "teacher"
    type = "S"
  }

  global_secondary_index {
    name               = "gsiIdx1"
    hash_key           = "teacher"
    range_key          = "id"
    projection_type    = "INCLUDE"
    non_key_attributes = ["id"]
  }

  point_in_time_recovery {
    enabled = true
  }

  tags = {
    Project = local.project_name_uc
  }

}

# ----------------------------------------------------------------------------------------------
# Dynamodb Table - Groups
# ----------------------------------------------------------------------------------------------
resource "aws_dynamodb_table" "groups" {
  name         = local.dynamodb_name_groups
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }
  attribute {
    name = "subject"
    type = "S"
  }

  global_secondary_index {
    name            = "gsiIdx1"
    hash_key        = "subject"
    range_key       = "id"
    projection_type = "ALL"
  }

  point_in_time_recovery {
    enabled = true
  }

  tags = {
    Project = local.project_name_uc
  }
}

# ----------------------------------------------------------------------------------------------
# Dynamodb Table - Words
# ----------------------------------------------------------------------------------------------
resource "aws_dynamodb_table" "words" {
  name         = local.dynamodb_name_words
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"
  range_key    = "groupId"

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "groupId"
    type = "S"
  }

  attribute {
    name = "nextTime"
    type = "S"
  }

  global_secondary_index {
    name            = "gsiIdx1"
    hash_key        = "groupId"
    range_key       = "nextTime"
    projection_type = "ALL"
  }

  point_in_time_recovery {
    enabled = true
  }

  tags = {
    Project = local.project_name_uc
  }
}

# ----------------------------------------------------------------------------------------------
# Dynamodb Table - Word Master
# ----------------------------------------------------------------------------------------------
resource "aws_dynamodb_table" "word_master" {
  name         = local.dynamodb_name_word_master
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }

  point_in_time_recovery {
    enabled = true
  }

  tags = {
    Project = local.project_name_uc
  }
}

# ----------------------------------------------------------------------------------------------
# Dynamodb Table - Traces
# ----------------------------------------------------------------------------------------------
resource "aws_dynamodb_table" "traces" {
  name         = local.dynamodb_name_traces
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "qid"
  range_key    = "timestamp"
  attribute {
    name = "qid"
    type = "S"
  }
  attribute {
    name = "timestamp"
    type = "S"
  }
  attribute {
    name = "userId"
    type = "S"
  }

  global_secondary_index {
    name            = "gsiIdx1"
    hash_key        = "userId"
    range_key       = "timestamp"
    projection_type = "ALL"
  }

  point_in_time_recovery {
    enabled = true
  }

  tags = {
    Project = local.project_name_uc
  }
}

# ----------------------------------------------------------------------------------------------
# Dynamodb Table - Word Ignore
# ----------------------------------------------------------------------------------------------
resource "aws_dynamodb_table" "word_ignore" {
  name         = local.dynamodb_name_word_ignore
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"
  range_key    = "word"

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "word"
    type = "S"
  }

  point_in_time_recovery {
    enabled = true
  }

  tags = {
    Project = local.project_name_uc
  }
}


# ----------------------------------------------------------------------------------------------
# Dynamodb Table - Words
# ----------------------------------------------------------------------------------------------
resource "aws_dynamodb_table" "questions" {
  name         = local.dynamodb_name_questions
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "groupId"
    type = "S"
  }

  global_secondary_index {
    name            = "gsiIdx1"
    hash_key        = "groupId"
    range_key       = "id"
    projection_type = "ALL"
  }

  point_in_time_recovery {
    enabled = true
  }

  tags = {
    Project = local.project_name_uc
  }
}

# ----------------------------------------------------------------------------------------------
# Dynamodb Table - Learning
# ----------------------------------------------------------------------------------------------
resource "aws_dynamodb_table" "learning" {
  name         = local.dynamodb_name_learning
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "qid"
  range_key    = "userId"

  attribute {
    name = "qid"
    type = "S"
  }

  attribute {
    name = "userId"
    type = "S"
  }

  attribute {
    name = "nextTime"
    type = "S"
  }

  attribute {
    name = "groupId"
    type = "S"
  }

  attribute {
    name = "subject_weekly"
    type = "S"
  }

  attribute {
    name = "subject_status"
    type = "S"
  }

  attribute {
    name = "priority"
    type = "S"
  }

  global_secondary_index {
    name            = "gsiIdx1"
    hash_key        = "userId"
    range_key       = "nextTime"
    projection_type = "ALL"
  }

  global_secondary_index {
    name            = "gsiIdx2"
    hash_key        = "groupId"
    range_key       = "nextTime"
    projection_type = "ALL"
  }

  global_secondary_index {
    name               = "gsiIdx3"
    hash_key           = "userId"
    range_key          = "subject_weekly"
    projection_type    = "INCLUDE"
    non_key_attributes = ["qid"]
  }

  global_secondary_index {
    name            = "gsiIdx4"
    hash_key        = "userId"
    range_key       = "subject_status"
    projection_type = "ALL"
  }

  global_secondary_index {
    name               = "gsiIdx5"
    hash_key           = "userId"
    range_key          = "priority"
    projection_type    = "INCLUDE"
    non_key_attributes = ["qid", "groupId", "subject"]
  }

  point_in_time_recovery {
    enabled = true
  }

  tags = {
    Project = local.project_name_uc
  }
}


# ----------------------------------------------------------------------------------------------
# Dynamodb Table - Settings
# ----------------------------------------------------------------------------------------------
resource "aws_dynamodb_table" "settings" {
  name         = local.dynamodb_name_settings
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }

  point_in_time_recovery {
    enabled = true
  }

  tags = {
    Project = local.project_name_uc
  }
}

# ----------------------------------------------------------------------------------------------
# Dynamodb Table - Curriculums
# ----------------------------------------------------------------------------------------------
resource "aws_dynamodb_table" "curriculums" {
  name         = local.dynamodb_name_curriculums
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "guardian"
    type = "S"
  }

  attribute {
    name = "groupId"
    type = "S"
  }

  attribute {
    name = "userId"
    type = "S"
  }

  global_secondary_index {
    name            = "gsiIdx1"
    hash_key        = "guardian"
    range_key       = "groupId"
    projection_type = "ALL"
  }

  global_secondary_index {
    name            = "gsiIdx2"
    hash_key        = "groupId"
    range_key       = "userId"
    projection_type = "ALL"
  }

  point_in_time_recovery {
    enabled = true
  }

  tags = {
    Project = local.project_name_uc
  }
}

# ----------------------------------------------------------------------------------------------
# Dynamodb Table - Reports
# ----------------------------------------------------------------------------------------------
resource "aws_dynamodb_table" "reports" {
  name         = local.dynamodb_name_reports
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "userId"
  range_key    = "typeDate"

  attribute {
    name = "userId"
    type = "S"
  }

  attribute {
    name = "typeDate"
    type = "S"
  }

  point_in_time_recovery {
    enabled = true
  }

  tags = {
    Project = local.project_name_uc
  }
}

# ----------------------------------------------------------------------------------------------
# Dynamodb Table - WSS connections
# ----------------------------------------------------------------------------------------------
resource "aws_dynamodb_table" "wss" {
  name         = local.dynamodb_name_wss_connections
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "guardian"
  range_key    = "userId"

  attribute {
    name = "guardian"
    type = "S"
  }

  attribute {
    name = "userId"
    type = "S"
  }

  point_in_time_recovery {
    enabled = true
  }

  tags = {
    Project = local.project_name_uc
  }
}

# ----------------------------------------------------------------------------------------------
# Dynamodb Table - WSS connections
# ----------------------------------------------------------------------------------------------
resource "aws_dynamodb_table" "inquiry" {
  name         = local.dynamodb_name_inquiry
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "qid"

  attribute {
    name = "qid"
    type = "S"
  }

  point_in_time_recovery {
    enabled = true
  }

  tags = {
    Project = local.project_name_uc
  }
}
