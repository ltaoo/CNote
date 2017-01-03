import program from 'commander';

import Evernote from './Evernote';
import init from './init';
import clone from './clone';
import pull from './pull';
import updateDb from './updateDb';
import downloadDb from './downloadDb';
// 导入笔记
import importNote from './importNote';

// 获取执行命令的目录
const sourceDir = process.cwd();
// 初始化一些默认的信息
program
//版本信息
    .version('0.1.0')
    // 配置项
    //.option('-n, --create [value]', '将笔记上传至印象笔记')

/*
 *  可使用的命令
*/

// 第一次运行使用的命令，用来初始化
program.command('init')
    .description('初始化应用，初始化后如需要同步印象笔记，使用 clone')
    .action((dirname) => {
        // 初始化就是在本地初始化 note 文件夹和 db.json 数据库
        init(sourceDir, dirname);
    });

// 第二步
program.command('clone')
    .description('第一次使用时执行，从印象笔记获取所有笔记')
    .action(() => {
        clone();
        console.log('\n===== clone 完成 =====\n');
    });

program
    .command('create <file>')
    .description('上传笔记到印象笔记')
    .action((path) => {
        //
        Evernote.uploadNote(path);
    });


// 更新指定笔记
program.command('update <file>')
    .description('更新指定笔记')
    .action(path => {
        Evernote.updateNote(path);
    });

// 批量从云端更新到本地
program.command('pull')
    .description('从印象笔记拉取更新，类似 git 的 pull')
    .action(() => {
        pull();
    })

// 从为知笔记导入笔记
program.command('import')
    .description('导入 Json 格式的笔记')
    .action((dirname) => {
        importNote(dirname);
    })


program
    .command('push')
    .description('将所有修改提交至印象笔记，类似 git 的 push')
    .action(() => {
        // 遍历文件夹，比对，性能很有问题。。。
    })

program.command('refresh')
    .description('将本地数据库同步到云端')
    .action(() => {
        updateDb();
    })

program.command('download')
    .description('从云端获取数据库到本地')
    .action(() => {
        downloadDb();
    })


program.parse(process.argv);