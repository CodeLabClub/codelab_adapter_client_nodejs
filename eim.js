const AdapterNode = require('codelab_adapter_client_nodejs');
const ADAPTER_TOPIC = "adapter/extensions/data";


class EIMNode extends AdapterNode {

    constructor() {

        super({
            name: 'EIMNode'
        });

        //get the reply messages
        this.num = 0;
        this.receive_loop();
    }

    message_handle(topic, payload) {
        console.log(`topic: ${topic}, payload: ${payload}`)
    }

    pub_message(){
        this.num += 1;
        const message = {topic:ADAPTER_TOPIC, payload: { content: this.num} };
        this.publish_payload(message.payload, message.topic);

    }

    run(){
        this.pub_message();
        //setInterval(this.pub_message, 1000);
    }
}

try {
    m = new EIMNode();
    m.run();
}
catch (err) {
    console.log(err);
    process.exit()
}
