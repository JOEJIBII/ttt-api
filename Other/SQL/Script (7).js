db.getCollection("member-Test").findOneAndUpdate(
    {
        _id: ObjectId("6289c259736aa75c78c35e5e")

    },
    {
        $inc: {
            "financial.withdraw_count": 1.0,
        },

    },
    
)

