export var global = 
{
	"sdk":[
		{
			"label":"OpenVINO",
			"name":"openvino/ubuntu18_data_dev",
			"samples":[
					"/opt/intel/openvino/inference_engine/samples/c",
					"/opt/intel/openvino/inference_engine/samples/cpp",
					"/opt/intel/openvino/inference_engine/samples/python"
			],
			"demos":[
				{"name":"Image Classification" ,"command":"docker run -it -u 0 --rm openvino/ubuntu18_data_dev  /bin/bash -c \"apt update && apt install sudo && deployment_tools/demo/demo_squeezenet_download_convert_run.sh -d CPU -sample-options -no_show\""},
				{"name":"Vehicle and License Plate Detection","command": "docker run -it -u 0 --rm openvino/ubuntu18_data_dev  /bin/bash -c \"apt update && apt install sudo && deployment_tools/demo/demo_security_barrier_camera.sh -d CPU -sample-options -no_show\""}
			],
			"documentation":"https://docs.openvinotoolkit.org/latest/documentation.html"
		},
		{
			"label":"oneAPI",
			"name":"intel/oneapi-aikit",
			"samples":[
	
			],
			"demos":[],
			"documentation":"https://docs.oneapi.com/versions/latest/index.html"
		}
	],
	"reference_Implementations":[{"name":{"en":"Person Detection"},"modifiedOn":"2020-02-28T04:18:02.000Z","baseImage":"ubuntu@sha256:d3b8b26602942b6e87976d8f77a01a2d8fcd5e7ee7ec7713ec6cf8990866086a","image":"ubuntu-nano","tag":"18.04","id":"5e58947ae16686023a807dbc"},{"name":{"en":"Person Detection"},"modifiedOn":"2020-02-28T04:18:02.000Z","baseImage":"ubuntu@sha256:d3b8b26602942b6e87976d8f77a01a2d8fcd5e7ee7ec7713ec6cf8990866086a","image":"ubuntu-nano","tag":"18.04","id":"60302e9560599b4cee1bfce1"},{"name":{"en":"Automated Checkout"},"modifiedOn":"2020-02-28T04:18:02.000Z","image":"automated-checkout/ms-ledger","tag":"dev","id":"5e58948ae16686023a807db1"},{"name":{"en":"Automated Checkout"},"modifiedOn":"2020-02-28T04:18:02.000Z","image":"automated-checkout/ms-inventory","tag":"dev","id":"5e58948ae16686023a807db2"},{"name":{"en":"Automated Checkout"},"modifiedOn":"2020-02-28T04:18:02.000Z","image":"automated-checkout/ms-authentication","tag":"dev","id":"5e58948ae16686023a807db3"},{"name":{"en":"Automated Checkout"},"modifiedOn":"2020-02-28T04:18:02.000Z","image":"automated-checkout/ds-cv-inference","tag":"dev","id":"5e58948ae16686023a807db4"},{"name":{"en":"Automated Checkout"},"modifiedOn":"2020-02-28T04:18:02.000Z","image":"automated-checkout/ds-controller-board","tag":"dev","id":"5e58948ae16686023a807db5"},{"name":{"en":"Automated Checkout"},"modifiedOn":"2020-02-28T04:18:02.000Z","image":"automated-checkout/ds-card-reader","tag":"dev","id":"5e58948ae16686023a807db6"},{"name":{"en":"Automated Checkout"},"modifiedOn":"2020-02-28T04:18:02.000Z","image":"automated-checkout/as-controller-board-status","tag":"dev","id":"5e58948ae16686023a807db7"},{"name":{"en":"Automated Checkout"},"modifiedOn":"2020-02-28T04:18:02.000Z","image":"automated-checkout/as-vending","tag":"dev","id":"5e58948ae16686023a807db8"},{"name":{"en":"Automated Checkout"},"modifiedOn":"2020-02-28T04:18:02.000Z","image":"automated-checkout/build","tag":"latest","id":"5e58948ae16686023a807db9"},{"name":{"en":"Person Detection"},"modifiedOn":"2020-02-28T04:18:02.000Z","image":"person-detection","tag":"1.0","id":"5e58947ae16686323a807dbc"}]
}
;