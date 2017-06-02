<style scoped>
body.modal-open #pubkey {
  overflow: hidden;
}
</style>

<template>

  <div class="container offset-md-3 col-md-6" id="app">

    <div id="errMsg" class="alert alert-danger alert-dismissible fade in" style="display: none" role="alert">
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
      Failed to generate certificate!
    </div>

    <form accept-charset="utf-8">
      <div class="form-group">
          <label class="col-xs-4" style="padding-left: 0">Sign for:</label>
          <div class="col-xs-8">
              <label class="radio-inline">
                  <input v-model="target" id="user-option" name="target" type="radio" value="user" :checked="target === 'user'">
                  User
              </label>
              <label class="radio-inline">
                  <input v-model="target" id="host-option" name="target" type="radio" value="host" :checked="target === 'host'">
                  Host
              </label>
          </div>
      </div>

      <div class="form-group">
        <label for="pubkey">Public Key (required):
        <input type="file" class="form-control-file" @change="onFileChange" id="pubkeyFile">
        </label>
        <textarea v-model.trim="publicKey" class="form-control" rows="5" id="pubkey" placeholder="Paste or upload your key"></textarea>
      </div>
      <div class="form-group row">
        <label class="col-xs-4 col-form-label" for="identity">Identity (required):</label>
        <div class="col-xs-8">
          <input v-model.trim="identity" type="text" class="form-control" id="identity" placeholder="Key identity">
        </div>
      </div>

      <div class="form-group row">
        <label class="col-xs-4 col-form-label" for="principals">Principals (optional):</label>
        <div class="col-xs-8">
          <input type="text" class="form-control" id="principals" placeholder="Principals (user or host names)">
        </div>
      </div>

      <div class="row form-group">
        <label class="col-xs-4 col-form-label" for="expire">Expiration date (optional):</label>
        <div class="col-xs-8">
          <input type="text" class="form-control" id="expire">
        </div>
      </div>

      <button @click.stop="sign" :disabled="!publicKey || !identity" type="button" class="btn btn-primary">Generate!</button>
    </form>

    <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">

          <div class="modal-body">
            <textarea v-model="certificate" class="form-control" style="min-width: 100%" rows="10"></textarea>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button @click.stop="download" type="button" class="btn btn-primary">Download</button>
          </div>

        </div>
      </div>
    </div>

  </div>
</template>

<script>

export default {
  name: 'app',
  data() {
    return {
      publicKey: '',
      identity: '',
      target: 'user',
      certificate: '',
    }
  },
  methods: {
    sign: function(evt) {
      const form = document.forms[0]
      const result = {
        pubkey: this.publicKey,
        identity: this.identity,
        host: this.target === 'host'
      }
      const args = ['principals', 'expire']
      args.forEach((ele) => {
        result[ele] = form.elements[ele].value
      })
      const vm = this
      this.$http.post('/api/sign', result)
      .then((res) => res.data)
      .then((cert) => {
        vm.certificate = cert
        $('#myModal').modal()
      })
      .catch((err) => {
        console.error(err)
        $("#errMsg").fadeTo(2000, 500).slideUp(500, function(){
            $("#errMsg").slideUp(500);
        })
      })
    },
    onFileChange: function(evt) {
      const files = evt.target.files
      const vm = this
      if (!files.length) {
        console.error('No files')
        return
      }
      const reader = new FileReader()
      reader.readAsText(files[0])
      reader.onload = function(evt) {
        vm.publicKey = evt.target.result
      }
    },
    download: function() {
      const element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(this.certificate));
      element.setAttribute('download', this.identity + '-cert.pub');
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  }
}
</script>
