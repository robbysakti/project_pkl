import Swal from "sweetalert2"

function errorResponseHandler(error) {
    if(error) {
        let message

        if(error.response) {
            if(error.response.status === 500) message = "Something went wrong with server"
            else message = error.response.data.message
        }
        Swal.fire({
            customClass: {
                container: 'my-swal'
            },
            title: 'Gagal..!',
            text: message,
            icon: 'warning'
        })
        return Promise.reject(error)
    }
}

export default errorResponseHandler