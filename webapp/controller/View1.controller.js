sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "sap/m/MessageBox",
        "sap/m/MessageToast",
        "sap/ui/model/json/JSONModel",
        "sap/ui/model/odata/v2/ODataModel",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */

	function (Controller, MessageBox, MessageToast, JSONModel, ODataModel, Filter, FilterOperator) {
        "use strict";
        
        const toastConfig = {
            duration: 1000
        }

        let viewComponents = {}
        let oModel = null
        let urlModel = "/sap/opu/odata/SAP/ZT55_35_OVLY_SRV/"

        // let oDataSource = {
        //     firstName: "Gabriel",
        //     lastName: "Dias",
        //     students: [
        //         {
        //             firstName: "Aluno 1",
        //             lastName: "Teste 1"
        //         },
        //         {
        //             firstName: "Aluno 2",
        //             lastName: "Teste 2"
        //         },
        //         {
        //             firstName: "Aluno 3",
        //             lastName: "Teste 3"
        //         }
        //     ]
        // }

		return Controller.extend("ovly.fiori35.alunos.controller.View1", {

             onInit: function(){
                viewComponents = {
                    listStudents:  this.byId("list-students") ,
                    inputName: this.byId("input-name"),
                    inputLastName: this.byId("input-lastname"),
                    inputDate: this.byId("input-date"),
                    inputId: this.byId("input-id")
                }

                oModel = new ODataModel(urlModel)

                this.getView().setModel(oModel)
            },

			onSaveStudent: function () {

                if(viewComponents.inputName.getValue() === ""){
                    MessageBox.error("Nome Obrigatório")
                    return
                }

                if(viewComponents.inputLastName.getValue() === ""){
                    MessageBox.error("SobreNome Obrigatório")
                    return
                }

                var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy-MM-ddTKK:mm:ss" });
                var lv_date_val = new Date(viewComponents.inputDate.mProperties.dateValue);
                var dateStr = dateFormat.format(lv_date_val);

                let oData={
                    "Id": viewComponents.inputId.getValue(),
                    "FirstName": viewComponents.inputName.getValue(),
                    "LastName": viewComponents.inputLastName.getValue(),
                    "BirthDate" : dateStr
                }

                if(viewComponents.inputId.getValue() == ""){
                    oModel.create("/Students", oData, 
                    { success: (event) => {
                        MessageBox.success("Aluno Adicionado!")
                    }, error: (event) => {

                    }});
                } else {
                    oModel.update(`/Students('${viewComponents.inputId.getValue()}')`, oData, 
                    { success: (event) => {
                        MessageBox.success("Aluno Modificado!")
                    }, error: (event) => {

                    }});
                }

                
                viewComponents.inputName.setValue("")
                viewComponents.inputLastName.setValue("")
                viewComponents.inputId.setValue("")                
                
            },

            onDeleteStudent: function () {

                const selectedItem = viewComponents.listStudents.getSelectedItem()
                var oContext = selectedItem.getBindingContext()

                MessageBox.show(`Deseja realmente deletar o Aluno (${oContext.getProperty("FirstName")} ${oContext.getProperty("LastName")})?`, {
                    icon: MessageBox.Icon.INFORMATION,
                    title: "Alerta!",
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    onClose: function (oAction) {  
                        if(oAction == "YES"){
                            oModel.remove(`/Students('${oContext.getProperty("Id")}')`, {success: (oEvent) => {
                                MessageBox.success(`Aluno ${oContext.getProperty("FirstName")} ${oContext.getProperty("LastName")} Deletado com sucesso`)   
                            }, error: (oEvent) => {
                                MessageBox.success(`Erro ${oEvent}`)   
                            }});  
                        }
                                               
                    }
                });                
            },
            
            onClearStudent: function(){                                
                viewComponents.inputName.setValue("")
                viewComponents.inputLastName.setValue("")
                viewComponents.inputId.setValue("")

                MessageToast.show("Campos Reinicializados!", toastConfig)
            },

            onSelectionChange: function(oEvent){                
                let selectedItem = oEvent.mParameters.listItem.getBindingContext()

                viewComponents.inputName.setValue(selectedItem.getProperty("FirstName"))
                viewComponents.inputLastName.setValue(selectedItem.getProperty("LastName"))
                viewComponents.inputId.setValue(selectedItem.getProperty("Id"))

                var dateConverted = JSON.stringify(selectedItem.getProperty("BirthDate"));
                var newDate = new Date(selectedItem.getProperty("BirthDate"))
                viewComponents.inputDate.setValue(newDate.toLocaleDateString())
            },

            onSearch: function (oEvent) {
                var oSource = oEvent.getSource();
                var aFilters = [];
                var sQuery = oEvent.getSource().getValue()
                
                if (sQuery && sQuery.length > 0) {
                    var filter = new Filter("FirstName", FilterOperator.Contains, sQuery)
                    aFilters.push(filter)
                }

                // update list binding
                var oBinding = viewComponents.listStudents.getBinding("items")
                oBinding.filter(aFilters)
		    }

        });
	});
