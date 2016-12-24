const config = require('./config');
const fs = require('fs');
const path = require('path');
const MarkdownIt = require('markdown-it'),
    md = new MarkdownIt();


const juice = require('juice');
const lib = require('./lib');

const APP_NAME = config.getAppName();

//  在云端创建笔记
function _makeNote(note) {
    const noteStore = config.getNoteStore();
    return new Promise((resolve, reject) => {
        const {
            noteTitle,
            noteBody,
            parentNotebook,
            created,
            tagNames
        } = note;
        let nBody = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
        nBody += "<!DOCTYPE en-note SYSTEM \"http://xml.evernote.com/pub/enml2.dtd\">";
        nBody += "<en-note>" + noteBody + "</en-note>";
        // Create note object
        // let ourNote = new Evernote.Note();
        let ourNote = {};
        ourNote.title = noteTitle;
        ourNote.content = nBody;
        // 创建时间
        ourNote.created = created || new Date().getTime();
        // 标签
        ourNote.tagNames = tagNames;

        // parentNotebook is optional; if omitted, default notebook is used
        if (parentNotebook && parentNotebook.guid) {
            ourNote.notebookGuid = parentNotebook.guid;
        }

        // Attempt to create note in Evernote account
        noteStore.createNote(ourNote)
            .then(note => {
                // console.log(note);
                resolve(note);
            })
            .catch(err => {
                reject(err);
            })
    })
}

// 更新云端笔记
function _updateNote(note) {
    const noteStore = config.getNoteStore();
    return new Promise((resolve, reject) => {
        const {
            guid,
            noteTitle,
            noteBody,
            parentNotebook,
            created,
            tagNames,
            attributes
        } = note;
        // console.log(guid)
        let nBody = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
        nBody += "<!DOCTYPE en-note SYSTEM \"http://xml.evernote.com/pub/enml2.dtd\">";
        nBody += "<en-note>" + noteBody + "</en-note>";
        // Create note object
        // let ourNote = new Evernote.Note();
        let ourNote = {};
        ourNote.title = noteTitle;
        ourNote.content = nBody;
        // 创建时间
        ourNote.created = created || new Date().getTime();
        // 标签
        ourNote.tagNames = tagNames;
        // guid
        ourNote.guid = guid;
        // 
        ourNote.attributes = attributes;
        // parentNotebook is optional; if omitted, default notebook is used
        if (parentNotebook && parentNotebook.guid) {
            ourNote.notebookGuid = parentNotebook.guid;
        }

        // Attempt to create note in Evernote account
        noteStore.updateNote(ourNote)
            .then(note => {
                // console.log(note);
                resolve(note);
            })
            .catch(err => {
                reject(err);
            })
    })
}

module.exports = {
    _makeNote,
    _updateNote
};