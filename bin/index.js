#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const glob = require('glob')
const chokidar = require('chokidar')
const _ = require('lodash')
const config = JSON.parse(fs.readFileSync('smart-import.json'))

const CustomEvent = (() => {
    let events = {}
    let on = (type, cb) => {
        if (!events[type]) {
            events[type] = []
        }
        events[type].push(cb)
    }
    let emit = (type, data) => {
        for (let i = 0; i < events[type].length; i++) {
           events[type][i].apply(this, [data])
        }
    }
    return {
        on,
        emit
    }
})()

class SmartImport {
    constructor({ from, ignored }) {
        this.from = from
        this.ignored = ignored
        this.extname = path.extname(from)
        this.modules = glob.sync(from, {
            ignore: ignored
        })
    }

    init() {
        CustomEvent.on('push', m => {
            console.log('Do pushing')
            this.modules.push(m)
        })
        CustomEvent.on('remove', m => {
            console.log('Do removing')
            _.remove(this.modules, p => p === m)
        })
        this.watch()
    }

    watch() {
        const { from, ignored, extname, modules } = this
        chokidar
            .watch(path.dirname(from), {
                ignoreInitial: true,
                ignored
            })
            .on(
                'add',
                this.checkExt(file => {
                    CustomEvent.emit('push', file)
                })
            )
            .on(
                'unlink',
                this.checkExt(file => {
                    CustomEvent.emit('remove', file)
                })
            )
    }

    checkExt(cb) {
        const { extname } = this
        return file => {
            if (path.extname(file) === extname) {
                cb(file)
            }
        }
    }
}

let smartImport = new SmartImport(config)
smartImport.init()
