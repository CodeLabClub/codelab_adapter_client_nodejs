const AdapterNode = require('codelab_adapter_client_nodejs');
// const AdapterNode = require("./index");

const ADAPTER_TOPIC = "adapter/extensions/data";

class HelloWorldNode extends AdapterNode {
  constructor() {
    super({
      name: "EIMNode"
    });

    //get the reply messages
    this.num = 0;
    this.receive_loop();
  }

  message_handle(topic, payload) {
    console.log(
      `from scratch: topic: ${topic}, payload: ${JSON.stringify(payload)}`
    );
    const content = payload.content;
    const reverse_content = content
      .split("")
      .reverse()
      .join("");
    const message = {
      topic: ADAPTER_TOPIC,
      payload: { content: reverse_content }
    };
    this.publish_payload(message.payload, message.topic);
  }

  pub_message() {
    this.num += 1;
    const message = { topic: ADAPTER_TOPIC, payload: { content: this.num } };
    this.publish_payload(message.payload, message.topic);
  }

  run() {
    // this.pub_message();
    //setInterval(this.pub_message, 1000);
  }
}

try {
  m = new HelloWorldNode();
  m.run();
} catch (err) {
  console.log(err);
  process.exit();
}
