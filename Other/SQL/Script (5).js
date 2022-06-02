db.getCollection("member-Test").insertOne({ 
    "agent_id" : ObjectId("6281446d5aa7df0156f3b462"), 
    "username" : "Nicky99", 
    "password" : "P@ssw0rd", 
    "tel" : "0900000001", 
    "pin" : "123456", 
    "line_id" : "Wutwanich12", 
    "name" : "Harden", 
    "surname" : null, 
    "birthday_date" : "16/08/2536", 
    "tag" : [
        ObjectId("6280b6899826206073109d4b"), 
        ObjectId("6280b6899826206073109d4b")
    ], 
    "channel" : [
        ObjectId("6280b6899826206073109d4b"), 
        ObjectId("6280b6899826206073109d4b")
    ], 
    "remark" : "5555T-T", 
    "register_ip" : "10.27.22.178", 
    "register_date" : "16/05/2022 01:20:28", 
    "user_reference" : "PAPON", 
    "promotion_status" : "", 
    "banking_account" : [
        {
            "bank_id" : ObjectId("6280b6899826206073109d4b"), 
            "bank_acct" : "1234567890", 
            "bank_name" : "kbank", 
            "bank_code" : null, 
            "bank_status" : "Active"
        }
    ], 
    "financial" : {
        "deposit_first_time_amount" : NumberInt(0), 
        "deposit_first_time" : null, 
        "deposit_count" : NumberInt(0), 
        "deposit_total_amount" : NumberInt(0), 
        "withdraw_first_time" : NumberInt(0), 
        "withdraw_count" : NumberInt(0), 
        "withdraw_total_amount" : NumberInt(0)
    }, 
    "status" : "N", 
    "cr_date" : "16/05/2022 01:20:28", 
    "cr_by" : "11000-create-user", 
    "cr_prog" : "11000-create-user", 
    "upd_date" : null, 
    "upd_by" : null, 
    "upd_prog" : null
}
)
