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
}

# ----------------------------------------------------------------------------------------------
# Dynamodb Table - Groups
# ----------------------------------------------------------------------------------------------
resource "aws_dynamodb_table" "groups" {
  name         = local.dynamodb_name_groups
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"
  range_key    = "userId"
  attribute {
    name = "id"
    type = "S"
  }
  attribute {
    name = "userId"
    type = "S"
  }

  global_secondary_index {
    name            = "gsiIdx1"
    hash_key        = "userId"
    range_key       = "id"
    projection_type = "ALL"
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

  # local_secondary_index {
  #   name               = "lsiIdx1"
  #   range_key          = "nextTime"
  #   projection_type    = "INCLUDE"
  #   non_key_attributes = ["times"]
  # }

  # local_secondary_index {
  #   name            = "lsiIdx2"
  #   range_key       = "lastTime"
  #   projection_type = "KEYS_ONLY"
  # }
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
}

# ----------------------------------------------------------------------------------------------
# Dynamodb Table - Histories
# ----------------------------------------------------------------------------------------------
resource "aws_dynamodb_table" "histories" {
  name         = local.dynamodb_name_histories
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "user"
  range_key    = "timestamp"
  attribute {
    name = "user"
    type = "S"
  }
  attribute {
    name = "timestamp"
    type = "S"
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
}
