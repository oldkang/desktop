/**
 * 数据
 * @type {Object}
 */
var data = {
    menu: {
        'main': [
            {
                callbackname: 'createFloder',
                name: '新建文件夹'
            },
//          {
//              callbackname: 'uploading',
//              name: '上传文件'
//          },
            {
                name: '排序',
                childer:[
          			{
                			callbackname: 'sortTime',
	                		name: '按时间排序'
	                },
	                {
                			callbackname: 'sortSpell',
	                		name: '按拼音排序'
	                }
                	]
            },
//          {
////              callbackname: 'sort',
//              name: '修改桌面背景'
//          }
        ],
        'file': [
//          {
////              callbackname: 'createFloder',
//              name: '打开'
//          },
//          {
//              name: '编辑'
//          },
            {
                callbackname: 'reName',
                name: '重命名'
            },
            {
                callbackname: 'reMove',
                name: '删除'
            }
//          ,
//          {
//              name: '复制'
//          }
        ],
        'recycle':[
        		{
        			callbackname: 'empty',
            		name: '清空回收站'
        		},
        		{
        			callbackname: 'reName',
            		name: '重命名'
        		}
        ]
    },
// 数据驱动视图
    list: [
        {
        		id: 1,
        		pid: 0,
//          type: 'icon',
            className: 'wasteBasket',
            name: '回收站'
        },
        {
        		id: 2,
        		pid: 0,
    			callbackname: 'openNewFile',
//          type: 'floder',
            className: 'floder',
            name: '文件夹'
        },
        {
        		id: 3,
        		pid: 0,
            type: 'txt',
            className: 'txt',
            name: '文本'
        },
        {
        		id: 4,
        		pid: 0,
            type: 'html',
            className: 'html',
            name: '页面'
        },
        {
        		id: 5,
        		pid: 0,
            type: 'jpg',
            className: 'img',
            name: '图片'
        },
        {
        		id: 6,
        		pid: 0,
            type: 'mp3',
            className: 'mp3',
            name: '音频'
        },
        {
        		id: 7,
        		pid: 0,
            type: 'mp4',
            className: 'mp4',
            name: '视频'
        }
    ]
};
