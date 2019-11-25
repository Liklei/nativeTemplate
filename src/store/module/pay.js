const state = {
    pay: "set pay info",
    tips: false
}
const getters = {

}
const actions = {

}
const mutations = {
    SET_PAY(state, pay) {
        state.pay = "reset pay info"
    },
    SET_TIPS(state, tips) {
        state.tips = tips
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}