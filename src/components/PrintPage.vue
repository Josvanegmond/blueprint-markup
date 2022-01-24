<script lang="ts">
import html2pdf from 'html2pdf.js'
import { defineComponent, getCurrentInstance, onMounted } from 'vue'
import { useRoute } from 'vue-router'

export default defineComponent({
  computed: {
    isPageA4() {
      return this.$route.query.page == "A4"
    },

    isPageLetter() {
      return this.$route.query.page == "Letter"
    },

    getImagesJSON() {
      return JSON.parse(this.$route.query.imagesJSON)
    }
  },

  methods: {
    getPageRegmarks() {
      const regmarksImg = this.$route.query.page == "Letter" ? 'letter-regmarks.png' : 'a4-regmarks.png'
      return regmarksImg
    },

    checkForPrint(image) {
      const printSetting = this.$route.query.printSetting
      const canPrint =
        (printSetting == "A4" && image.printA4) ||
        (printSetting == "Letter" && image.printA4) ||
        (printSetting == "Printshop" && image.printPrintshop)
      console.log(printSetting + " for " + image.printPrintshop + " is " + canPrint)
        
      return canPrint
    }
  },

  setup() {
    const downloadPDF = async() => {
      const query = useRoute().query
      const filename = query.filename

      const opt = {
        margin: 0,
        filename: filename + '.pdf',
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { dpi: 300, letterRendering: false, scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait',  }
      }

      if(query.page == "Letter") {
        opt.jsPDF.unit = 'in'
        opt.jsPDF.format = 'letter'
      }

      html2pdf().set(opt).from(getCurrentInstance().refs.pdf).save()
    }

    onMounted(downloadPDF)
  }
})

</script>

<template>
<div class="pdfcontainer" ref='pdf'>
  <div v-for="image in getImagesJSON" :key="image">
    <div :class="[{ 'page-a4': isPageA4, 'page-letter': isPageLetter }, image.align]" v-if="checkForPrint(image)">
      <img v-if="image.regmarks" class="overlayimg" :src="getPageRegmarks()">
      <img class="pageimg" :src="image.url" >
    </div>
  </div>
</div>
</template>

<style scoped>

.container {
  width: 100%;
  height: 100%;
  background-color: white;
}

.pdfcontainer {
  margin: 0px;
  padding: 0px;
}

.page-a4 {
  width: 210mm;
  height: 297mm;
  background-color: white;
}
.page-letter {
  width: 8.5in;
  height: 11in;
  background-color: white;
}

.start {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
}

.middle {
  display: flex;
  align-items: center;
  justify-content: center;
}

.end {
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
}

.pageimg {
  width: 210mm;
  height: 11in;
}

.overlayimg {
  position: absolute;
  width: inherit;
  height: inherit;
}


</style>
