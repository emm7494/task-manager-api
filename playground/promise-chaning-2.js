require('../src/db/mongoose');

const Task = require('../src/models/tasks');

//Tasks.findByIdAndDelete('5dd9f8c1f271133bb1c85a71')
//    .then(
//        user => {
//            console.log(user);
//            return Tasks.countDocuments({ completed: false });
//        }
//    )
//    .then(
//        result => console.log(result)
//    )
//    .catch(
//        error => console.log(error)
//    );

const deleteTaskAndCount = async (id, completed=false) => {
    const user = await Task.findByIdAndDelete(id);
    const count = await Task.countDocuments(
        {
            completed
        }
    );
    return count;
};

deleteTaskAndCount('5ddb032e38ed913f6697b018')
    .then(
        result => console.log(result)
    )
    .catch(
        error => console.log(error)
    );
