const { MongoClient, Logger: MongoLogger, ObjectID } = require("mongodb");

const connectionURL = "mongodb://127.0.0.1:27017";
const databaseName = "task-manager";

//MongoLogger.setLevel('info');
MongoClient.connect(
  connectionURL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  (error, client) => {
    if (error) return console.log(error);

    const db = client.db(databaseName);
    //    const updatePromise = () => db.collection('users')
    //        .updateOne(
    //            {
    //                _id: new ObjectID("5dd86d2c3b43c55c7d9ab69f")
    //            },
    //            {
    //                $inc: {
    //                   age: 1
    //                }
    //            }
    //        );
    //    updatePromise()
    //        .then(
    //            result => {
    //                console.log(result);
    //            }
    //        )
    //        .catch(
    //            error => {
    //                console.log(error);
    //            }
    //        );

    //    updateTasksPromise = () => db.collection('tasks')
    //        .updateMany(
    //            {
    //                completed: false
    //            },
    //            {
    //                $set: {
    //                    completed: true
    //                }
    //            }
    //        );
    //    updateTasksPromise()
    //        .then(
    //            result => console.log(result)
    //        )
    //        .catch(
    //            error => console.log(error)
    //
    //        );
    //    const deleteTasksPromise = () => db.collection('tasks')
    //        .deleteOne(
    //            {
    //                description: 'Very Difficult'
    //            }
    //        );
    //
    //    deleteTasksPromise()
    //        .then(
    //            result => console.log(result)
    //        )
    //        .catch(
    //            error => console.log(error)
    //        );
  }
);
