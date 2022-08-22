# pocket-cards-terraform

環境構築管理用リポジトリ

## Architecture

![Architecture](./Serverless_Architecture.png)

## CI/CD Pipeline

![Pipeline](./Serverless_Pipeline.png)

## Methods

| Status | Method ID | Path                           | Resource Id | Http Method | Lambda |
| ------ | --------- | ------------------------------ | ----------- | ----------- | ------ |
|        | m001      | /history                       | r001        | GET         | A002   |
|        | m002      | /groups                        | r002        | POST        | B001   |
|        | m003      | /groups/{groupId}              | r003        | GET         | B002   |
|        | m004      | /groups/{groupId}              | r003        | PUT         | B003   |
|        | m005      | /groups/{groupId}              | r003        | DELETE      | B004   |
|        | m006      | /groups/{groupId}/words        | r004        | POST        | C001   |
|        | m007      | /groups/{groupId}/words        | r004        | GET         | C002   |
|        | m008      | /groups/{groupId}/words/{word} | r005        | GET         | C003   |
|        | m009      | /groups/{groupId}/words/{word} | r005        | PUT         | C004   |
|        | m010      | /groups/{groupId}/new          | r006        | GET         | C006   |
|        | m011      | /groups/{groupId}/test         | r007        | GET         | C007   |
|        | m012      | /groups/{groupId}/review       | r008        | GET         | C008   |
|        | m013      | /image2text                    | r009        | POST        | D001   |
|        | m014      | /image2line                    | r010        | POST        |
