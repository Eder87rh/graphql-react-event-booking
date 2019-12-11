const bcrypt = require("bcryptjs");

const Event = require("../../models/event");
const User = require("../../models/user");

const events = async eventsIds => {
  try {
    const events = await Event.find({_id: {$in: eventsIds}})  
    return events.map(event => {
      return {
        ...event._doc,
        _id: event.id,
        date: new Date(event._doc.date).toISOString(),
        creator: user.bind(this, event.creator)
      };
    })


  } catch (error) {
    throw new Error(error);
  }
}

const user = async userId => {
  try {
    const user = await User.findById(userId)
    return { 
      ...user._doc,
      _id: user.id,
      createdEvents: events.bind(this, user._doc.createdEvents)
    }
  } catch (error) {
    throw new Error(error);
  }

}

module.exports = {
  events: async () => {
    try {
      const events = await Event.find()
      return events.map(event => {
        return {
          ...event._doc, 
          _id: event.id,
          date: new Date(event._doc.date).toISOString(),
          creator: user.bind(this, event._doc.creator)
        }
      })
    } catch (error) {
      console.log(error);
    }

  },
  createEvent: async (args) => {
      const event = new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: +args.eventInput.price,
        date: new Date(args.eventInput.date),
        creator: "5df14ab1810c4813e0b69f91"
      });

     let createdEvent;
      try {
        const result = await event.save()
        console.log("TCL: user", user)
        
        createdEvent = { 
          ...result._doc,
          date: new Date(event._doc.date).toISOString(),
          creator: user.bind(this, result._doc.creator) 
        }

        const userDB = await User.findById("5df14ab1810c4813e0b69f91")
  
        if (!userDB) {
          throw new Error("User not found")
        }

        userDB.createdEvents.push(event);
        await userDB.save();
  
        return createdEvent;
      } catch (error) {
        console.log("TCL: error", error)
        throw new Error(error)
      }
  },
  createUser: async args => {
    try {
      const existingUser = await User.findOne({
        email: args.userInput.email
      })

      if (existingUser) {
        throw new Error("User exists already")
      }

      const hashedPassword = await bcrypt.hash(args.userInput.password, 12)

      const user = new User({
        email: args.userInput.email,
        password: hashedPassword
      });

      const result = await user.save();

      return { ...result._doc, password: null, _id: result.id }
    } catch (error) {
      console.log("TCL: error", error)
      throw new Error(error)
    }
  }
}