# 说说你对Relay的理解

https://relay.dev/

Relay是Facebook在React.js Conf（2015年1月）上首次公开的一个新框架，用于为React应用处理数据层问题。

在Relay中，每个组件都使用一种叫做GraphQL的查询语句声明对数据的依赖。组件可以使用 this.props 访问获取到的数据。

主要用于超大型项目中

Relay, the producion-ready GraphQL client for React. it support scaling your application to thousands of components, while keeping management of data fetching sane, and fast iteration speeds as your application grows and changes.

另：GraphQL 是一种针对 Graph（图状数据）进行查询特别有优势的 Query Language（查询语言）
GraphQL is a query language for APIs and a runtime for fulfilling those queries with your existing data.