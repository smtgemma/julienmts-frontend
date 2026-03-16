import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import StepTitle from './stepTitle';
import { useDispatch } from 'react-redux';
import { setProductValue } from '@/redux/features/startMeeting/startMeetingSlice';
import { useMeetingSalesPersonMutation } from '@/redux/api/startMettingApi/startMettingApi';
import { toast } from 'sonner';
import DashboardButton from '../shared/dashboardButton/DashboardButton';

const Step1 = (
    { handleNext }: { handleNext: () => void }
) => {
    const [formData, setFormData] = useState({
        productName: '',
        productUrl: '',
        description: '',
    });
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const dispatch = useDispatch()

    const [meetingSalesPerson, { isLoading }] = useMeetingSalesPersonMutation()

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDrag = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e: any) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file: any) => {
        const validTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/svg',
            'image/gif',
            'image/webp'
        ];

        const maxSize = 10 * 1024 * 1024;

        if (validTypes.includes(file.type) && file.size <= maxSize) {
            setUploadedFile(file);
        } else {
            toast.error('Please upload PDF, DOC, PPTX, or Image files (Max 10MB)');
        }
    };

    const handleSubmit = async () => {

        // ✅ Basic empty field validation
        if (!formData.productName.trim()) {
            toast.error("Product Name is required");
            return;
        }
        if (!formData.productUrl.trim()) {
            toast.error("Product URL is required");
            return;
        }
        if (!formData.description.trim()) {
            toast.error("Description is required");
            return;
        }
        if (!uploadedFile) {
            toast.error("Please upload a product material");
            return;
        }

        // ✅ Product URL format validation
        const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[\w-./?%&=]*)?$/;
        if (!urlPattern.test(formData.productUrl)) {
            toast.error("Please enter a valid product URL");
            return;
        }

        const fromFristStepData = {
            formData,
            uploadedFile,
        }

        try {
            const formDataToSend = new FormData();

            // ✅ Send as "bodyData" key with JSON string value (matching Postman)
            const bodyData = {
                product_name: formData.productName,
                product_url: formData.productUrl,
                description: formData.description,
            };

            formDataToSend.append("bodyData", JSON.stringify(bodyData));

            if (uploadedFile) {
                formDataToSend.append("materials", uploadedFile);
            }

            const response = await meetingSalesPerson(formDataToSend).unwrap();
            // console.log(response, "==============")
            if (response.success) {
                toast.success(response.message)
                dispatch(setProductValue(response.data));
                handleNext();
            }

        } catch (error: any) {

            const errorMessage =
                error?.data?.errorMessages?.[0]?.message ||
                error?.data?.message ||
                "Something went wrong";

            toast.error(errorMessage);
        }
    };

    return (
        <div className="bg-white rounded-xl p-6 w-full border border-[#D1D6DB]">

            {/* Header */}
            <StepTitle title='What Are You Selling?' subtitle='Provide details about your product or service' />

            {/* Product Name */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-[#2D2D2D] mb-2.5">
                    Product/Service Name
                </label>
                <input
                    type="text"
                    name="productName"
                    value={formData.productName}
                    onChange={handleInputChange}
                    placeholder="Enter product name"
                    className="w-full border border-[#D1D6DB] rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#6E51E0]"
                />
            </div>
            {/* Product url */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-[#2D2D2D] mb-2.5">
                    Product Url
                </label>
                <input
                    type="text"
                    name="productUrl"
                    value={formData.productUrl}
                    onChange={handleInputChange}
                    placeholder="Enter Product url"
                    className="w-full border border-[#D1D6DB] rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#6E51E0]"
                />
            </div>

            {/* Description */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-[#2D2D2D] mb-2.5">
                    Description
                </label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter product description"
                    rows={4}
                    className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-[#6E51E0]"
                />
            </div>

            {/* Upload Section */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-[#2D2D2D] mb-2.5">
                    Upload Product Materials
                </label>

                <div
                    className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition 
                        ${dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 bg-gray-50'}
                        hover:border-indigo-500 hover:bg-indigo-50
                    `}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('fileInput')?.click()}
                >
                    <input
                        id="fileInput"
                        type="file"
                        accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.webp"
                        onChange={handleFileChange}
                        className="hidden"
                    />

                    {/* Upload Icon */}
                    <div className="flex justify-center mb-2">
                        <Upload className='text-2xl text-[#64748B]' />
                    </div>
                    <p className="text-[#636F85] font-medium text-[16px]">Click to upload or drag and drop</p>
                    <p className="text-[#9BA4B0] text-sm">PDF, DOC, PPTX, Images (Max. 10MB)</p>

                    {uploadedFile && (
                        <p className="text-indigo-600 text-sm font-medium mt-2">
                            Uploaded: {uploadedFile.name}
                        </p>
                    )}
                </div>
            </div>

            {/* Button Footer */}
            <div className="flex justify-end mt-8">
                <DashboardButton
                    text="Next Step"
                    onClick={handleSubmit}
                    isLoading={isLoading} // RTK mutation loading state
                />
            </div>

        </div>
    );
};

export default Step1;
