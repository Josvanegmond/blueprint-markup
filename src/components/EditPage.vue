<script lang="ts">
import { PrinterIcon, FolderOpenIcon } from '@heroicons/vue/solid'
import { FileSelector, Dropzone, DialogButton } from 'vue3-file-selector'
import { defineComponent, Ref, ref, watch } from 'vue'

export default defineComponent({
  components: { 
    PrinterIcon, 
    FolderOpenIcon,
    FileSelector,
    Dropzone,
    DialogButton
  },

  methods: {
    /**
     * Prints the blueprints to new PrintPage windows for each selected setting
     * @param windowName name of the page setting
     * @param pageSize page size (A4, Letter)
     * @param fileName name of the blueprint
     * @param imagesJSON image data
     */
    printTo(windowName: string, pageSize: string, fileName: string, imagesJSON: {}) {
      const routeData = this.$router.resolve({
        path: '/print',
        query: {
          filename: fileName + '-' + windowName,
          page: pageSize,
          imagesJSON: imagesJSON,
          printSetting: windowName
        }
      })
      window.open(routeData.href, windowName)
    },

    /**
     * Prints all given images to pdfs, depending on the settings (A4, Letter, Printshop)
     * @param fileName name of the blueprint
     * @param images image data
     * @param printA4 prints to A4 PDF
     * @param printLetter prints to Letter PDF
     * @param printPrintshop prints to A4 for Printshop
     */
    print(fileName: string, images: {}[], printA4: boolean, printLetter: boolean, printPrintshop: boolean) {
      const imagesJSON = JSON.stringify(images)
      if(printA4) {
        this.printTo('A4', 'A4', fileName, imagesJSON)
      }
      if(printLetter) {
        this.printTo('Letter', 'Letter', fileName, imagesJSON)
      }
      if(printPrintshop) {
        this.printTo('Printshop', 'A4', fileName, imagesJSON)
      }
    },

    /**
     * Returns the page size as page-letter or page-a4 for current page setting, for css purposes
     */
    getPageSize() {
      const pageSize = this.pageSize == 'Letter' ? 'page-letter' : 'page-a4'
      return pageSize
    },

    /**
     * Returns the regmark file path for current page setting (Letter or A4)
     */
    getPageRegmarks() {
      const pageSize = this.pageSize == 'Letter' ? 'letter-regmarks.png' : 'a4-regmarks.png'
      return pageSize
    },

    /**
     * Changes the order of an image in the image array
     * @param images image array to rearrange
     * @param oldNumber old index number
     * @param newNumber new index number 
     */
    changePageNumber(images, oldNumber, newNumber) {
      let image = images[oldNumber]
      images.splice(oldNumber, 1)
      images.splice(newNumber, 0, image)

      images.forEach((image, index) => {image.pageNumber = index})
    }
  },

  setup() {
    const previews: Ref<File[]> = ref([])
    const imgUrls: Ref<string[]> = ref([])
    const images = ref([])
    const pageSize = ref("A4")
    const fileName = ref("Blueprints")

    const printA4 = ref(true)
    const printLetter = ref(true)
    const printPrintshop = ref(true)

    //watches any changes in the previews array, which is filled by the user selecting images to load
    //on a change, the imgUrls array is filled with urls to the loaded images
    watch(previews, (previews, previewsOld) => {
      imgUrls.value = []
      previews.forEach((file: File) => {
        imgUrls.value.push(URL.createObjectURL(file))
      })
    }, { flush: 'post' })

    //watches any changes in the imgUrls array
    //on a change, the images array is filled with image data
    watch(imgUrls, (imgUrls) => {
      images.value = imgUrls.map((imgUrl, i) => { return {url:imgUrl, align:'start', regmarks:true, printA4:true, printLetter:true, printPrintshop:true, pageNumber: i} })
    })

    return {
      previews,
      images,
      pageSize,
      fileName,
      printA4,
      printLetter,
      printPrintshop
    }
  }
})
</script>

<template>
  <div class="container">
    <nav class="fixed menu z-50">
      <a @click="print(fileName, images, printA4, printLetter, printPrintshop)" class="button">
        <button class="bg-purple-500 hover:bg-purple-700 text-white font-bold py-3 px-3 rounded printer">
          <PrinterIcon class="h-5 w-5"/>
        </button>
      </a>
      
      <div class="checkboxlabel">
        <label for="printA4">A4</label>
        <input type="checkbox" id="printA4" v-model="printA4" checked>
      </div>
      
      <div class="checkboxlabel">
        <label for="printLetter">Letter</label>
        <input type="checkbox" id="printLetter" v-model="printLetter" checked>
      </div>
      
      <div class="checkboxlabel">
        <label for="printPrintshop">Printshop</label>
        <input type="checkbox" id="printPrintshop" v-model="printPrintshop" checked>
      </div>

      <div class="spacing"></div>
      
      <div class="checkboxlabel">
        <label for="A4">A4</label>
        <input v-model="pageSize" type="radio" name="pagesize" id="A4" value="A4" checked>
      </div>
      
      <div class="checkboxlabel">
        <label for="Letter">Letter</label>
        <input v-model="pageSize" type="radio" name="pagesize" id="Letter" value="Letter">
      </div>
    </nav>

    <main class="maincontainer">

      <file-selector v-model="previews" :accept="['image/png', 'image/jpeg']">
        <dropzone v-slot="{ hovered }">
          <div class="pagedropzone block w-full h-48 rounded-lg border-4 border-dashed border-gray transition-colors duration-150 flex flex-col space-y-4 justify-center items-center"
            :class="{ 'border-blue': hovered }">
            <dialog-button class="bg-purple-500 hover:bg-purple-700 text-white font-bold py-3 px-3 rounded printer">
              <FolderOpenIcon class="h-5 w-5"/>
            </dialog-button>
          </div>
        </dropzone>
      </file-selector>

      <div class="previewblock" v-for="(file, i) in images" :key="file.url">
          <div class="page-options-menu">
            <div class="page-options-row">
              <label>alignment</label>
              <select @change="(e) => { file.align = e.currentTarget.value }">
                <option value="start">Start</option>
                <option value="middle">Middle</option>
                <option value="end">End</option>
              </select>
              
              <label :for="'pageNumber'+i">Page number</label>
              <input type="input" size="2" :id="'pageNumber'+i" v-on:input="changePageNumber(images, i, file.pageNumber)" v-model="file.pageNumber" checked>
            </div>

            <div class="page-options-row">
              <input v-model="file.regmarks" type="checkbox" name="toggleregs" :id="'ToggleRegs'+i" value="ToggleRegs" checked>
              <label :for="'ToggleRegs'+i">Regmarks</label>
              
              <input type="checkbox" :id="'printA4'+i" v-model="file.printA4" checked>
              <label :for="'printA4'+i">A4</label>
              
              <input type="checkbox" :id="'printLetter'+i" v-model="file.printLetter" checked>
              <label :for="'printLetter'+i">Letter</label>
              
              <input type="checkbox" :id="'printPrintshop'+i" v-model="file.printPrintshop" checked>
              <label :for="'printPrintshop'+i">Printshop</label>
            </div>

          </div>

          <div class="page">
            <div :class="[file.align, getPageSize()]">
              <div class="pageimg">
                <img v-if="file.regmarks" class="overlayimg" :src="getPageRegmarks()">
                <img class="pageimg" :src="file.url">
              </div>
            </div>
          </div>
      </div>

    </main>
  </div>
</template>

<style scoped>
.container {
  width: 100vw;
  height: 100%;
  background-color: white;
}
.maincontainer {
  width: 100vw;
  height: 100%;
  margin-left:10px;
  background-color: white;
  padding-top:80px;
}

.menu {
  width: 100%;
  height: 60px;
  padding-top: 6px;
  padding-bottom: 6px;
  background-color: rgb(58, 6, 78);
}

.previewblock {
  width: 50vw;
  background-color: white;
  display:block;
  float:left;
}

.page-options-menu {
  width: 100%;
  height: 100%;
  display: block;
  float: left
}

.page-options-row {
  display: block;
  float: left;
  padding:10px;
}

.pagedropzone {
  width: 70vw;
  margin: auto auto 3vw auto;
}

.page {
  width: "100%";
  height: "100%";
  display: block;
  float: left;
  position: relative;
}

.page-a4 {
  width: 210mm;
  height: 297mm;
  background-color: gray;
  margin: auto auto 2vw auto;
  box-shadow: 3px 3px 4px 4px lightgray;
}

.page-letter {
  width: 8.5in;
  height: 11in;
  background-color: gray;
  margin: auto auto 2vw auto;
  box-shadow: 3px 3px 4px 4px lightgray;
}

.page > .start {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
}

.page > .middle {
  display: flex;
  align-items: center;
  justify-content: center;
}

.page > .end {
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
}


.pageimg {
  width: 210mm;
  height: 279.4mm;
}

.overlayimg {
  position: absolute;
  max-width: 100%;
  max-height: 100%;
}

.button {
  margin:6px;
}

.page-options-row > label {
  padding-left:4px;
  padding-right:4px;
}

.page-options-row > input {
  border: 1px solid black;
}

.checkboxlabel {
  color: white;
  padding: 0px 8px 0px 8px;
  font-weight: bold;
  display:inline;
}

.spacing {
  padding:15px;
  display:inline;
}

</style>
