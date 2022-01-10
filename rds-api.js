const { RESTDataSource } = require("apollo-datasource-rest")

class RDSAPI extends RESTDataSource {
  constructor() {
    super()
    this.baseURL = "https://evening-stream-23706.herokuapp.com/"
  }

  // GET
  async getPeople() {
    const response = await this.get("/")
    const stuff = JSON.parse(response)
    const moreStuff = stuff.recordsets[0]
    return Array.isArray(moreStuff)
      ? moreStuff.map(person => this.peopleReducer(person))
      : []
  }
  async getDonations() {
    const response = await this.get("/")
    const stuff = JSON.parse(response)
    const moreStuff = stuff.recordsets[1]
    return Array.isArray(moreStuff)
      ? moreStuff.map(item => this.donationReducer(item))
      : []
  }
  async getPersonDonation(person_id) {
    const response = await this.get("/")
    const l = JSON.parse(response)
    const m = l.recordsets[1]
    return Array.isArray(m)
      ? m.filter(t => {
          if (t.person_id === person_id) return this.donationReducer(t)
        })
      : []
  }
  async getPersonPhone(person_id) {
    const response = await this.get(`/${person_id}`)
    const l = JSON.parse(response)
    const m = l.recordsets[1]
    return Array.isArray(m)
      ? m.filter(t => {
          if (t.person_id === person_id) return this.phoneReducer(t)
        })
      : []
  }
  async getPersonAddress(person_id) {
    const response = await this.get(`/${person_id}`)
    const l = JSON.parse(response)
    const m = l.recordsets[2]
    return Array.isArray(m)
      ? m.filter(t => {
          if (t.person_id === person_id) return this.addressReducer(t)
        })
      : []
  }

  async getPersonById(person_id) {
    const response = await this.get(`/${person_id}`)
    const l = JSON.parse(response)
    const m = l.recordsets[0][0]
    return this.peopleReducer(m)
  }
  peopleReducer(person) {
    return {
      person_id: person.person_id,
      ssn: person.ssn,
      name: person.name,
      ethnicity: person.ethnicity,
      donations: this.getPersonDonation(person.person_id),
      phones: this.getPersonPhone(person.person_id),
      addresses: this.getPersonAddress(person.person_id),
    }
  }
  phoneReducer(phone) {
    return {
      phone_id: phone.phone_id,
      person_id: phone.person_id,
      phone: phone.phone,
      phone_type: phone.phone_type,
    }
  }
  addressReducer(address) {
    return {
      address_id: address.address_id,
      person_id: address.person_id,
      the_address: address.the_address,
      address_type: address.address_type,
    }
  }
  donationReducer(donation) {
    return {
      type: donation.type,
      amount: donation.amount,
      date: donation.date,
      memo: donation.memo,
      donation_id: donation.donation_id,
      person_id: donation.person_id,
    }
  }
}

module.exports = RDSAPI
