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
	"reference_Implementations":[

	]
}
;