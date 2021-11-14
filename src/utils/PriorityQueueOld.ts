export default class PriorityQueue<T> {
  #treeArr: (Node<T> | null)[] = [null];
  #compareContent = (e1: T, e2: T): number => {
    return e1 < e2 ? -1 : e1 > e2 ? 1 : 0;
  };
  #compare = (n1: Node<T>, n2: Node<T>) => {
    return this.#compareContent(n1.content, n2.content);
  };
  constructor(list?: T[], comparator?: (e1: T, e2: T) => number) {
    list?.map((elem) => this.push(elem));
    if (comparator) this.#compareContent = comparator;
  }
  get isEmpty() {
    return this.#treeArr.length < 2;
  }

  pop() {
    if (this.isEmpty) return null;
    let returnVal = this.#treeArr[1]?.content;
    let lastNode = this.#treeArr.pop()!;
    if (this.#treeArr.length < 2) this.#treeArr.push(lastNode);
    this.#treeArr[1]!.content = lastNode!.content;
    this.#downheap(this.#treeArr[1]);
    return returnVal;
  }

  push(elem: T) {
    let node = new Node(elem, this.#treeArr, this.#treeArr.length);
    this.#treeArr.push(node);
    this.#upheap(node);
  }

  #downheap = (node: Node<T> | null) => {
    if (!node) return;
    let smallestChild: Node<T> | null = null;
    if (!node.left) smallestChild = node.right;
    else if (!node.right) smallestChild = node.left;
    else smallestChild = node.left < node.right ? node.left : node.right;
    if (smallestChild) this.#swapContent(node, smallestChild);
    this.#downheap(smallestChild);
  };
  #upheap = (node: Node<T> | null) => {
    if (node == null || !node.parent) return;
    if (this.#compare(node, node.parent) >= 0) return;

    let sibling: Node<T> | null = null;
    if (node.isLeftChild) sibling = node.right;
    else sibling = node.left;

    if (!sibling || this.#compare(node, sibling) <= 0) {
      this.#swapContent(node, node.parent);
    } else {
      this.#swapContent(node.parent, sibling);
    }
    this.#upheap(node.parent);
  };

  #swapContent = (elem1: Node<T>, elem2: Node<T>) => {
    let temp = elem1.content;
    elem1.content = elem2.content;
    elem2.content = temp;
  };
}

class Node<T> {
  #idx: number;
  #treeArr: (Node<T> | null)[];
  content: T;
  get parent() {
    return this.#treeArr[Math.floor(this.#idx / 2)];
  }
  get right(): Node<T> | null {
    let rightIdx = 2 * this.#idx + 1;
    if (rightIdx >= this.#treeArr.length) return null;
    return this.#treeArr[rightIdx];
  }
  get left(): Node<T> | null {
    let leftIdx = 2 * this.#idx;
    if (leftIdx >= this.#treeArr.length) return null;
    return this.#treeArr[leftIdx];
  }
  get isLeftChild() {
    return this.#idx % 2 === 0;
  }
  constructor(content: T, treeArr: (Node<T> | null)[], idx: number) {
    this.content = content;
    this.#idx = idx;
    this.#treeArr = treeArr;
  }
}
