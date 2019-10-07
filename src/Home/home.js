import { mapActions, mapGetters } from 'vuex'
import _ from 'lodash'
import moment from 'moment'

const addCurrencyList = document.querySelector(".add-currency-list")
const additionDisabled = { 'disabled': true }
const currencyActive = { 'active': true }
let start = 5

export default {
  head() {
    title: 'Currency Converter'
  },
  data() {
    return {
      form: {
        currencyValue: 10
      },
      isDisabled: true,
      showCurrencyList: false,
      baseApi: 'https://api.exchangeratesapi.io/latest?base=',
      baseCurrency: 'USD'
    }
  },
  methods: {
    ...mapActions(['fetchRates','changeBaseRates']),
    ratesCurrency(abr) {
      if(this.rates[abr]) {
        return (this.form.currencyValue * this.rates[abr]).toFixed(4)
      }
      else {
         return (this.form.currencyValue * 1).toFixed(4)
      }
    },
    openListCurrency() {
      return this.showCurrencyList = !this.showCurrencyList 
    },
    checkCurrencyOnTheList() {
      for(let i=0; i<this.initializeCurrency.length; i++) {
        const currency = this.currencies.find(c => c.abbreviation===this.initializeCurrency[i].abbreviation)
        if(currency) {
          Object.assign(currency, additionDisabled)
        } 
      }
    },
    addToCurrencyList(isDisabled,curr) {
      if(!isDisabled) {
        let currencyChosen = _.find(this.currencies, { 'abbreviation': curr })
        // Object.assign(currencyChosen, additionDisabled)
        this.initializeCurrency.push(currencyChosen)
        start++
        this.$nextTick(() => {
          this.checkCurrencyOnTheList()
        })
        this.openListCurrency()
      }
    },
    removeCurrencyList(curr) {
      if(curr.abbreviation !== 'USD') {
        let currencyChosen = _.find(this.currencies, { 'abbreviation': curr })
        delete currencyChosen.disabled
        const currentArray = _.remove(this.initializeCurrency, function(n) {
          return n === currencyChosen
        })
        this.$nextTick(() => {
          this.checkCurrencyOnTheList()
        })
        start--
        this.update()
      }
    },
    setBaseCurrency(curr) {
      /* Check previous active state */
      console.log(curr)
      let currencyPrev = _.find(this.currencies, { 'active': true })
      let currencyChosen = _.find(this.currencies, { 'abbreviation': curr })
      if(currencyPrev) {
        delete currencyPrev.active
      }
      Object.assign(currencyChosen, currencyActive)
      this.changeBaseRates(`${this.baseApi}${curr}`).then(() => {
        this.baseCurrency = curr
        this.update()
      })
    },
    update() {
      this.$forceUpdate()
    }
  },
  computed: {
    ...mapGetters([
      'rates',
      'currencies'
    ]),
    getDate() {
      let dateNow = moment().format('MMMM Do YYYY')
      return dateNow
    },
    initializeCurrency() {
      let currenciesData = _.slice(this.currencies,0,start)
      return currenciesData
    }
  },
  mounted() {
    this.fetchRates()
    this.checkCurrencyOnTheList()
  }
}