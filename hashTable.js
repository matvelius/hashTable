// ID успешной посылки: 52347310

// ПРИНЦИП РАБОТЫ

// Мой алгоритм считывает команды get, put, и delete на входе и затем передаёт
// последующие данные соответстующим функциям хеш-таблицы. Для разрешения коллизий
// используется метод цепочек. Ответы на различные запросы накапливаются в массиве
// и выводятся в самом конце работы алгоритма после обработки последней команды.

// Хеширование и вычисление индекса ячейки производится простейшим методом 
// целочисленного деления ключа на большое простое число 130003, так как значения
// ключей уже являются целыми неотрицательными числами и не требуют преобразования.

// ДОКАЗАТЕЛЬСТВО КОРРЕКТНОСТИ

// Команда put проверяет, занята ли уже ячейка с данным индексом: если да, то новая пара
// ключ-значение добавляется в конец связного списка, а если нет, то создается новый
// headNode в данной ячейке. На каждом этапе проверяем, существует ли уже данный ключ
// в списке - если да, то просто обновляем значение.

// Команда get проверяет, существует ли уже значение в ячейке с данным индексом и далее
// проверяет каждую пару ключ-значение, проходя по связному списку. Если значение найдено,
// то оно добавляется к массиву outputArray, а если нет, то в массив добавляем "None".

// Команда delete расчитана на три основных варианта событий: удаление значения в начале
// связного списка, где-то в середине и в конце. Удаляемое значение либо строка "None"
// в случае, если пара ключ-значение не найдена, добаляется в массив outputArray.

// ВРЕМЕННАЯ СЛОЖНОСТЬ

// Обработка запроса: O(1) в среднем, так как операции с хеш-таблицей происходят мгновенно
// O(n) в случае если абсолютно все входные данные приводят к колизиям и приходится обходить 
// длинный связной список

// ПРОСТРАНСТВЕННАЯ СЛОЖНОСТЬ

// O(n), так как мы просто храним входные данные и вывод

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

      prevNode.next = new LLNode({ key, value })

    } else {

      this.hashTableArray[htIndex] = new LLNode({ key, value })

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

    return headNode != null ? this.findValue(headNode, key) : "None"

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