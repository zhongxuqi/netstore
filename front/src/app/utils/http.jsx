import NProgress from 'nprogress'

function get(url, data, successFunc, errorFunc, finalFunc) {
    $.ajax({
        type: 'GET',
        url: url,
        data: data,
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        success: (resp)=>{
            successFunc(resp)
            if (finalFunc != null) finalFunc()
        },
        error: (resp)=>{
            if (errorFunc != undefined) {
                errorFunc(resp)
            } else {
                alert("["+resp.status+"] "+resp.responseText)
            }
        },
    })
}

function post(url, data, successFunc, errorFunc) {
    $.ajax({
        type: 'POST',
        url: url,
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        success: (resp)=>{
            successFunc(resp)
            if (finalFunc != null) finalFunc()
        },
        error: (resp)=>{
            if (errorFunc != undefined) {
                errorFunc(resp)
            } else {
                alert("["+resp.status+"] "+resp.responseText)
            }
        },
    })
}

function deleteAction(url, data, successFunc, errorFunc) {
    $.ajax({
        type: 'DELETE',
        url: url,
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        success: (resp)=>{
            successFunc(resp)
            if (finalFunc != null) finalFunc()
        },
        error: (resp)=>{
            if (errorFunc != undefined) {
                errorFunc(resp)
            } else {
                alert("["+resp.status+"] "+resp.responseText)
            }
        },
    })
}

function postFile(url, formData, successFunc, errorFunc) {
    NProgress.start()
    $.ajax({
        type: "POST",
        url: url,
        data: formData,
        processData: false,
        contentType: false,
        dataType: "json",
        success: (resp) => {
            successFunc(resp)
            NProgress.done()
        },
        error: (resp) => {
            HttpUtils.alert("["+resp.status+"] "+resp.responseText)
            NProgress.done()
        },
    })
}

function alert(errMsg) {
    $.growl.error({ message: errMsg });
}

function notice(noticeMsg) {
    $.growl.notice({ message: noticeMsg });
}

export default {
    get: get,
    post: post,
    postFile: postFile,
    delete: deleteAction,
    alert: alert,
    notice: notice,
}
