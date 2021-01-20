# 算法基础07-位运算、布隆过滤器、LRU Cache

## 位运算

### 核心要领

想要熟练掌握位运算，**记住下面几个公式**即可：

- 清除 n 最低位的 1：`n & (n - 1)`
- 获取 n 最低位的 1：`n & -n`
- 整除 2：`n >> 1`
- 判断奇偶： `n & 1 == 1 | 0`
- `n & ~n = 0`

### 经典例题

### [52. N-Queens II](https://link.zhihu.com/?target=https%3A//leetcode-cn.com/problems/n-queens-ii/)

思路：

1. 回溯，时间复杂度 O(n!)，空间复杂度 O(n)
2. **位运算**，时间复杂度 O(n!)，空间复杂度 O(n)，由于位运算**更接近计算机底层**，所以运行速度会更快，位运算也是N-Queens问题的**终极解决方案**，算法的核心要点如下：

- 0 - 不能放皇后，1 - 能放
- `availPos = (~(cols | pie | na)) & ((1 << n) - 1)` 考虑整行、两条对角线，得到当前能放皇后的位置，用最低的 n 位表示
- `p = availPos & -availPos` 取得 availPos 最低位的1，用来放皇后
- `availPos &= (availPos - 1)` 清除最低位的 1，表示皇后已放
- `dfs(n, row + 1, cols | p, (pie | p) << 1, (na | p) >> 1)` 对 cols, pie, na 可放皇后的位置做相应的更新，下探下一层 ( Drill Down )



### Java 实现

```java
class Solution {
    private int count = 0;

    public int totalNQueens(int n) {
        dfs(n, 0, 0, 0, 0);
        return count;
    }

    private void dfs(int n, int row, int cols, int pie, int na) {
        if (row == n) {
            count++;
            return;
        }
        int availPos = (~(cols | pie | na)) & ((1 << n) - 1);
        while (availPos != 0) {
            int p = availPos & -availPos;
            availPos &= (availPos - 1);
            dfs(n, row + 1, cols | p, (pie | p) << 1, (na | p) >> 1);
        }
    }
}
```

### Python 实现

```python
class Solution:
    def totalNQueens(self, n: int) -> int:
        self.count = 0
        self.dfs(n, 0, 0, 0, 0)
        return self.count
    
    def dfs(self, n, row, cols, pie, na):
        if row == n:
            self.count += 1
            return
        
        availPos = (~(cols | pie | na)) & ((1 << n) - 1)

        while availPos:
            p = availPos & -availPos
            availPos &= (availPos - 1)
            self.dfs(n, row + 1, cols | p, (pie | p) << 1, (na | p) >> 1)
```

## 布隆过滤器（Bloom Filter）

### 本质

布隆过滤器由**一个很长的二进制向量**和**一系列随机映射函数**组成。用于检索一个元素是否在一个集合中。

- 优点是**空间效率和查询时间远超一般算法**
- 缺点是**有一定的错误识别率和删除困难**



![img](https://pic4.zhimg.com/80/v2-f9d1cf3df8d78da44bd2bdada86a9043_720w.jpg)



### 要点

布隆过滤器是一个快速判断元素是否存在集合的算法，特点是：

1. 不需要像哈希表一样存额外的信息
2. 只能判断**肯定不存在**或**可能存在**
3. 适合用作**高速缓存**，如判断为可能存在，再到数据库中查询
4. 每个元素的存在用几个**二进制位置 1** 来表示
5. 多用于大型分布式系统如比特币网络、Redis缓存、垃圾邮件过滤器、评论过滤器等



![img](https://pic3.zhimg.com/80/v2-670af45efa29c00ac97ec58de93f3b1e_720w.jpg)



## LRU Cache

最近最少使用缓存替换策略，是一种 [缓存替换策略](https://link.zhihu.com/?target=https%3A//www.wikiwand.com/en/Cache_replacement_policies)，其他缓存策略还有 FIFO、LFU、RR 等等。

LRU：Latest Recently Used 最近最少使用。



![img](https://pic3.zhimg.com/80/v2-62c53a6efda563c25f87b147ed5094f2_720w.jpg)



### 硬核实现 LRU Cache

接下来让我们自己造轮子，硬核实现一个 LRU Cache，它应该支持以下两个操作：

- 获取数据 `get(key)` - 如果密钥 (key) 存在于缓存中，则获取密钥的值（总是正数），否则返回 -1。
- 写入数据 `put(key, value)` - 如果密钥已经存在，则变更其数据值；如果密钥不存在，则插入该组「密钥/数据值」。当缓存容量达到上限时，它应该在写入新数据之前删除最久未使用的数据值，从而为新的数据值留出空间。

还有两个需求：

- 增加删除数据的时间复杂度为O(1)
- 随机访问数据的时间复杂度为O(1)

------

增删 O(1)，我们第一个想到要用 LinkedList，访问 O(1)，我们第一个想到要用 HashTable，那么怎么把两者结合起来呢？让我们从思考这两个问题开始：

1. 链表有特殊要求吗？单链表还是双向链表？
2. 链表中的节点存什么，只存 value 够吗？

先回答第一个问题，因为我们需要删除数据，链表删除节点需要找到当前节点的**前驱**，单链表想要找到节点前驱需要从头开始遍历，存在 O(n) 的时间复杂度；而双向链表本身就保存了节点的前驱，删除时间复杂度就是 O(1)，所以我们使用**双向链表**。

接下来回答第二个问题，由于缓存空间有限，当缓存存满时，根据 LRU 策略，我们需要移除缓存里保存最久的未被访问节点，比如上图中的 A 和 B，与此同时，我们还需要移除 HashMap 中的该节点（已不在缓存中，下次无法查到），如果节点只存 value，那么 HashMap 就无法移除该节点（哈希表删除节点需要 key， `map.remove(key)`），所以链表节点需要**同时存 key 和 value**，就像下图这样。



![img](https://pic3.zhimg.com/80/v2-9e7f80e1e3135f0ba3396a3fe870eb2a_720w.jpg)



解答了这两个问题，我们就可以开始动手了，先实现一个同时保存 key 和 value 的双向链表。

```java
class Node {
    public int key, val;
    public Node next, prev;

    public Node(int k, int v) {
        this.key = k;
        this.val = v;
    }
}

// 双向链表
class DoubleLinkedList {
    private Node head, tail; // 头尾虚节点
    private int size; // 链表元素数

    public DoubleLinkedList() {
        head = new Node(0, 0);
        tail = new Node(0, 0);
        head.next = tail;
        tail.prev = head;
        size = 0;
    }

    // 在链表头部添加节点
    public void addFirst(Node node) {
        node.next = head.next;
        node.prev = head;
        head.next.prev = node;
        head.next = node;
        size++;
    }
    
    // 删除链表中的节点（该节点一定存在）
    public void remove(Node node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
        size--;
    }
    
    // 删除链表中最后一个节点，并返回该节点
    public Node removeLast() {
        if (tail.prev == head)
            return null;
        Node last = tail.prev;
        remove(last);
        return last;
    }
    
    // 返回链表长度
    public int size() {
        return size;
    }
}
```

接下来就是正式实现 LRU Cache 了，核心逻辑写在注释上了。

```java
class LRUCache {
    private HashMap<Integer, Node> map;
    private DoubleLinkedList cache;
    private int cap; // 最大容量

    public LRUCache(int capacity) {
        this.cap = capacity;
        map = new HashMap<>();
        cache = new DoubleLinkedList();
    }

    // 访问节点
    public int get(int key) {
        if (!map.containsKey(key)) {
            return -1;
        }
        int val = map.get(key).val;
        // 使用put方法把最近访问的节点提前
        put(key, val);
        return val;
    }

    public void put(int key, int value) {
        // 生成新的节点
        Node node = new Node(key, value);
        if (map.containsKey(key)) {
            // 删除旧的节点，新的插到头部
            cache.remove(map.get(key));
            cache.addFirst(node);
            // 更新 map 中对应的数据
            map.put(key, node);
        } else {
            // 如果缓存满了
            if (cap == cache.size()) {
                // 删除链表最后一个数据
                Node last = cache.removeLast();
                // 哈希表也要删
                map.remove(last.key);
            }
            // 新节点添加到头部
            cache.addFirst(node);
            map.put(key, node);
        }
    }
}
```

最后多说一句，如果我们把这两部分合起来，其实就得到了 [LeetCode 146](https://link.zhihu.com/?target=https%3A//leetcode-cn.com/problems/lru-cache/) 的**最佳题解**，我想这也是面试题中对 LRU Cache 实现的**最高要求**了。