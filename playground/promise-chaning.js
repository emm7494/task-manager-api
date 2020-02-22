require('../src/db/mongoose');

const User = require('../src/models/users');

//User.findByIdAndUpdate(
//    '5dda01ac6708d2512eccdac0',
//    {
//        age: 29
//    }
//)
//    .then(
//
//        user => {
//            console.log(user);
//            return User.countDocuments({ age: 29 });
//        }
//    )
//    .then(
//        result => console.log(result)
//    )
//    .catch(
//        error => console.log(error)
//    );

const updateAgeAndCount = async (id, age) => {
    const user = await User.findByIdAndUpdate(
        id,
        {
            age
        }
    );
    const count = await User.countDocuments(
        {
            age
        }
    );
    return count;
};

updateAgeAndCount('5dda01ac6708d2512eccdac0', 18)
    .then(
        result => console.log(result)
    )
    .catch(
        error => console.log(error)
    );