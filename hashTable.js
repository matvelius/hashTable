const { exit } = require('process');
let readline = require('readline');
let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

let lineIndex = 0
let numberOfQueries = 0
let hashTable = null
let hashTableSize = 130003

const outputArray = []

rl.on('line', function (line) {

  if (lineIndex == 0) {

    numberOfQueries = parseInt(line)
    hashTable = new HashTable()

  } else if (lineIndex < numberOfQueries) {

    processCommand(line)

  } else { // last line

    processCommand(line)

    console.log(outputArray.join('\n'))
    exit(0)

  }

  lineIndex += 1
})

class HashTable {

  constructor() {
    this.hashTableSize = hashTableSize
    this.hashTableArray = new Array(this.hashTableSize).fill(null)
  }

  put(key, value) {

    const htIndex = getHTIndex(key)
    let headNode = this.hashTableArray[htIndex]

    if (headNode != null) {

      let node = headNode
      let prevNode = headNode

      while (node != null) {

        if (node.keyValuePair.key == key) { // if key is already in the hash table, update value
          node.keyValuePair.value = value
          return
        }

        prevNode = node
        node = node.next

      }

      prevNode.next = new LLNode({ key: key, value: value })

    } else {

      this.hashTableArray[htIndex] = new LLNode({ key: key, value: value })

    }

    return

  }

  delete(key) {

    const htIndex = getHTIndex(key)
    let headNode = this.hashTableArray[htIndex]
    let prevNode = null

    for (let node = headNode; node != null; node = node.next) {

      if (node.keyValuePair.key == key) { // found the key value pair

        let value = node.keyValuePair.value // save value before deletion

        if (node == headNode) { // deleting from the beginning of the Linked List

          this.hashTableArray[htIndex] = headNode.next

        } else if (node.next == null) { // deleting from the end of the Linked List

          prevNode.next = null

        } else { // deleting from somewhere in the middle of the Linked List

          prevNode.next = node.next

        }

        return value

      }

      prevNode = node

    }
    return "None"
  }

  get(key) {

    const htIndex = getHTIndex(key)
    const headNode = this.hashTableArray[htIndex]

    if (headNode != null) {
      return this.findValue(headNode, key)
    } else {
      return "None"
    }

  }

  findValue(headNode, key) {
    for (let node = headNode; node != null; node = node.next) {
      if (node.keyValuePair.key == key) {
        return node.keyValuePair.value
      }
    }
    return "None"
  }

}

function processCommand(commandLine) {

  const commandArray = commandLine.split(' ')
  const command = commandArray[0]
  const key = parseInt(commandArray[1])

  if (command == "put") {

    const value = parseInt(commandArray[2])
    hashTable.put(key, value)

  } else if (command == "get") {

    outputArray.push(hashTable.get(key))

  } else if (command == "delete") {

    outputArray.push(hashTable.delete(key))

  }

}

function getHTIndex(num) {
  return num % hashTableSize
}

class LLNode {
  constructor(keyValuePair = null, next = null) {
    this.keyValuePair = keyValuePair;
    this.next = next;
  }
}