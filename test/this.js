let obj = {
    say() {
        return 'hello world';
    },
    hello() {
        console.log(this.say());
    }
}

obj.hello();