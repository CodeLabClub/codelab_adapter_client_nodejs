//https://medium.com/the-andela-way/build-and-publish-your-first-npm-package-a4daf0e2431
//https://github.com/zeromq/zeromq.js/

const msgpack = require("msgpack-lite");
const zmq = require("zeromq");

const ADAPTER_TOPIC = "adapter/extensions/data";
const SCRATCH_TOPIC = "scratch/extensions/command";
const EXTENSIONS_OPERATE_TOPIC = "core/extensions/operate";
const EXTENSIONS_STATUS_TOPIC = "core/extensions/status";
const NOTIFICATION_TOPIC = "core/notification";

class MessageNode {
  constructor(
    name = "",
    codelab_adapter_ip_address = undefined,
    subscriber_port = "16103",
    publisher_port = "16130",
    subscriber_list = [SCRATCH_TOPIC, EXTENSIONS_OPERATE_TOPIC]
  ){
    this.name = name;
    this.subscriber_port = subscriber_port;
    this.publisher_port = publisher_port;
    this.subscriber_list = subscriber_list;
    this.buffer = undefined;

    if (codelab_adapter_ip_address) {
      this.codelab_adapter_ip_address = codelab_adapter_ip_address;
    } else {
      this.codelab_adapter_ip_address = "127.0.0.1";
    }

    // print a header to the console
    console.log(`\n************************************************************\n
        Codelab Adapter ip address: ${this.codelab_adapter_ip_address}\n
        Subscriber Port = ${this.subscriber_port}\n
        Publisher  Port = ${this.publisher_port}\n
        ************************************************************\n`);

    // Setup and connect to the subscriber socket on the message hub.
    this.subscriber = zmq.socket("sub");
    this.subscriber.connect(
      "tcp://" + this.codelab_adapter_ip_address + ":" + this.publisher_port
    );

    this.publisher = zmq.socket("pub");
    this.publisher.connect(
      "tcp://" + this.codelab_adapter_ip_address + ":" + this.publisher_port
    );

    // set subscriber topic
    this.subscriber_list.forEach(topic => {
      this.set_subscriber_topic(topic);
    });
  }

  set_subscriber_topic(topic) {
    if (typeof topic === "string" || topic instanceof String) {
      this.subscriber.subscribe(topic);
    } else {
      //Throw an exception
      throw Error("Topic must be of string type");
    }
  }

  publish_payload(payload, topic) {
    if (typeof topic === "string" || topic instanceof String) {
      this.buffer = msgpack.encode(payload);
      this.publisher.send([topic, this.buffer]);
    } else {
      throw new Error("Publisher topic must be a string");
    }
  }

  receive_loop() {
    this.subscriber.on("message", (topic, message) => {
      this.message_handle(topic.toString(), msgpack.decode(message));
    });
  }

  message_handle(topic, payload) {
    console.log(
      "received a message related to:",
      topic,
      "containing payload:",
      payload
    );
  }

  clean_up() {
    this.subscriber = null;
    this.publisher = null;
    process.exit(0);
  }
}

class AdapterNode extends MessageNode {
  // todo : https://github.com/wwj718/codelab_adapter_client/blob/master/codelab_adapter_client/base.py#L179
  constructor(
    name = "", 
    codelab_adapter_ip_address = undefined,
    subscriber_list = [SCRATCH_TOPIC, EXTENSIONS_OPERATE_TOPIC]) {
        super({
            name: name,
            codelab_adapter_ip_address:codelab_adapter_ip_address,
            subscriber_list:subscriber_list
            });
  } 
}

module.exports = AdapterNode;
