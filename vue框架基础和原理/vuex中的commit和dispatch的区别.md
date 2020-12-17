# vuex中的commit和dispatch的区别

dispatch：含有异步操作，例如向后台提交数据，写法： this.$store.dispatch('action方法名',值)

commit：同步操作，写法：this.$store.commit('mutations方法名',值)