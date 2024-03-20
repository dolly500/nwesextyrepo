const mongoose = require('mongoose');

const questionnaireSchema = new mongoose.Schema({
  religion: {
    type: String,
    enum: ['Christianity', 'Islam', 'Others'],
    required: true
  },
  genderOptions: {
    type: String,
    enum: ['Male', 'Female'],
    required: true
  },
  relationshipStatusOptions: {
    type: String,
    enum: ['Single', 'Married', 'Divorced', 'Separated', 'Others'],
    required: true
  },
  sexLife: {
    type: String,
    enum: ['Divorce', 'Adoption', 'Infertility', 'Infidelity', 'Pregnancy', 'Postpartum depression', 'Others'],
    required: true
  },
  consultationPrice: {
    type: String,
    required: true
  },
  therapyOption: {
    type: String,
    enum: ['Individual', 'Couples', 'Teens'],
    required: true
  }
});

module.exports = mongoose.model('Questionnaire', questionnaireSchema);
