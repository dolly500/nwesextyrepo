const mongoose = require('mongoose');

const questionnaireSchema = new mongoose.Schema({
  religion: {
    type: String,
    enum: ['Christianity', 'Islam', 'Others'],
    required: true
  },
  gender: {
    type: [String],
    enum: ['Male', 'Female'],
    required: true
  },
  relationshipStatus: {
    type: [String],
    enum: ['Single', 'Married', 'Divorced', 'Separated', 'Others'],
    required: true
  },
  helpReason: {
    type: String,
    required: true
  },
  optionsAvailable: {
    type: [String],
    enum: ['Your Sex Life','Differences with your spouse', 'Divorce', 'Adoption', 'Infertility', 'Infidelity', 'Pregnancy', 'Postpartum depression', 'Others'],
    required: true
  },
  consultationFee: {
    type: String,
    required: true
  },
  therapyType: {
    type: [String],
    enum: ['Individual', 'Couples', 'Teens'],
    required: true
  }
});

module.exports = mongoose.model('Questionnaire', questionnaireSchema);
