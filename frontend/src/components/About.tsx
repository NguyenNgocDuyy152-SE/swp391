import React from 'react';

const About: React.FC = () => {
    return (
        <div className="bg-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-blue-900 mb-6">Về Trung Tâm Y Tế Tinh Trùng Chill</h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Nơi mang lại hy vọng và hạnh phúc cho hàng nghìn gia đình Việt Nam
                    </p>
                </div>

                {/* Introduction with Image */}
                <div className="flex flex-col md:flex-row gap-12 items-center mb-16 bg-blue-50 rounded-2xl p-8 shadow-sm">
                    <div className="md:w-1/2">
                        <img
                            src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=2073&auto=format&fit=crop"
                            alt="Trung tâm Y tế"
                            className="rounded-xl shadow-lg w-full h-auto object-cover"
                        />
                    </div>
                    <div className="md:w-1/2">
                        <h2 className="text-3xl font-bold text-blue-800 mb-6">Sứ Mệnh Của Chúng Tôi</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Tại Trung Tâm Y Tế Tinh Trùng Chill, chúng tôi cam kết mang đến dịch vụ chăm sóc sức khỏe sinh sản
                            toàn diện, chu đáo và tiên tiến cho các cá nhân và cặp đôi đang gặp khó khăn về khả năng sinh sản.
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                            Sứ mệnh của chúng tôi là giúp các gia đình phát triển thông qua các công nghệ sinh sản tiên tiến,
                            đồng thời duy trì tiêu chuẩn cao nhất về chất lượng y tế và chăm sóc bệnh nhân.
                        </p>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    <div className="bg-white rounded-xl p-8 shadow-md text-center border-t-4 border-blue-600 hover:shadow-xl transition-shadow">
                        <div className="text-blue-600 mb-4">
                            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">50+</h3>
                        <p className="text-gray-600">Chuyên gia y tế hàng đầu</p>
                    </div>
                    <div className="bg-white rounded-xl p-8 shadow-md text-center border-t-4 border-blue-600 hover:shadow-xl transition-shadow">
                        <div className="text-blue-600 mb-4">
                            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path>
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">5.000+</h3>
                        <p className="text-gray-600">Ca điều trị thành công</p>
                    </div>
                    <div className="bg-white rounded-xl p-8 shadow-md text-center border-t-4 border-blue-600 hover:shadow-xl transition-shadow">
                        <div className="text-blue-600 mb-4">
                            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path>
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">15+</h3>
                        <p className="text-gray-600">Năm kinh nghiệm</p>
                    </div>
                </div>

                {/* Our Services with Images */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-blue-800 mb-6 text-center">Dịch Vụ Chuyên Môn</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                            <img
                                src="https://img.freepik.com/free-photo/embryologist-ivf-laboratory-working-with-test-tubes-petri-dishes-research_1303-29732.jpg"
                                alt="Thụ tinh trong ống nghiệm"
                                className="w-full h-64 object-cover"
                            />
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-gray-800 mb-3">Thụ tinh trong ống nghiệm (IVF)</h3>
                                <p className="text-gray-600">
                                    Quy trình thụ tinh ống nghiệm hiện đại với tỷ lệ thành công cao nhất khu vực.
                                    Đội ngũ bác sĩ giàu kinh nghiệm và trang thiết bị hiện đại giúp tối ưu hóa kết quả điều trị.
                                </p>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                            <img
                                src="https://img.freepik.com/free-photo/specialist-medical-uniform-examining-woman-hospital_1303-25514.jpg"
                                alt="Đánh giá khả năng sinh sản"
                                className="w-full h-64 object-cover"
                            />
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-gray-800 mb-3">Đánh giá khả năng sinh sản</h3>
                                <p className="text-gray-600">
                                    Chẩn đoán toàn diện về khả năng sinh sản cho cả nam và nữ. Xác định nguyên nhân vô sinh và
                                    đề xuất phương pháp điều trị phù hợp nhất cho từng trường hợp cụ thể.
                                </p>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                            <img
                                src="https://img.freepik.com/free-photo/laboratory-microscope-with-digital-tablet-desk_1262-4464.jpg"
                                alt="Phân tích và điều trị tinh trùng"
                                className="w-full h-64 object-cover"
                            />
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-gray-800 mb-3">Phân tích và điều trị tinh trùng</h3>
                                <p className="text-gray-600">
                                    Chuyên sâu về các vấn đề tinh trùng với công nghệ phân tích hiện đại nhất.
                                    Phương pháp điều trị cá nhân hóa dựa trên tình trạng cụ thể của từng bệnh nhân.
                                </p>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                            <img
                                src="https://img.freepik.com/free-photo/scientist-looking-dna-samples-laboratory_23-2148876687.jpg"
                                alt="Xét nghiệm di truyền"
                                className="w-full h-64 object-cover"
                            />
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-gray-800 mb-3">Xét nghiệm và tư vấn di truyền</h3>
                                <p className="text-gray-600">
                                    Phát hiện sớm các bất thường di truyền có thể ảnh hưởng đến khả năng sinh sản.
                                    Tư vấn chuyên sâu về các vấn đề di truyền và lựa chọn phương pháp điều trị phù hợp.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Our Approach */}
                <div className="flex flex-col md:flex-row gap-12 items-center mb-16 bg-blue-50 rounded-2xl p-8 shadow-sm">
                    <div className="md:w-1/2">
                        <h2 className="text-3xl font-bold text-blue-800 mb-6">Phương Pháp Tiếp Cận</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Chúng tôi tin vào phương pháp tiếp cận toàn diện đối với chăm sóc sức khỏe sinh sản.
                            Đội ngũ chuyên gia giàu kinh nghiệm kết hợp chuyên môn y tế với hỗ trợ tâm lý để
                            đồng hành cùng bạn trong hành trình sinh sản.
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                            Chúng tôi hiểu rằng tình hình của mỗi bệnh nhân là độc đáo, và chúng tôi phát triển
                            kế hoạch điều trị cá nhân hóa đáp ứng nhu cầu và mục tiêu cụ thể của bạn.
                        </p>
                    </div>
                    <div className="md:w-1/2">
                        <img
                            src="https://img.freepik.com/free-photo/professional-medical-team-working-with-female-patient-hospital-office_1303-21203.jpg"
                            alt="Tư vấn bệnh nhân"
                            className="rounded-xl shadow-lg w-full h-auto object-cover"
                        />
                    </div>
                </div>

                {/* Facilities with Grid Images */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-blue-800 mb-6 text-center">Cơ Sở Vật Chất Hiện Đại</h2>
                    <p className="text-gray-700 text-center max-w-4xl mx-auto mb-8">
                        Trung tâm của chúng tôi được trang bị công nghệ và cơ sở vật chất hiện đại nhất để cung cấp
                        dịch vụ chăm sóc chất lượng cao nhất. Từ thiết bị phòng thí nghiệm tiên tiến đến không gian
                        bệnh nhân thoải mái, chúng tôi đảm bảo rằng mọi khía cạnh của quá trình điều trị đều được
                        thực hiện trong môi trường an toàn, hỗ trợ và công nghệ cao.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <img
                            src="https://img.freepik.com/free-photo/modern-equipped-laboratory_144627-25526.jpg"
                            alt="Thiết bị phòng thí nghiệm"
                            className="rounded-lg shadow-md hover:shadow-lg transition-shadow h-56 w-full object-cover"
                        />
                        <img
                            src="https://img.freepik.com/free-photo/beautiful-doctor-office-hospital_23-2149326973.jpg"
                            alt="Phòng tư vấn"
                            className="rounded-lg shadow-md hover:shadow-lg transition-shadow h-56 w-full object-cover"
                        />
                        <img
                            src="https://img.freepik.com/free-photo/interior-view-operating-room_1170-2254.jpg"
                            alt="Phòng điều trị"
                            className="rounded-lg shadow-md hover:shadow-lg transition-shadow h-56 w-full object-cover"
                        />
                        <img
                            src="https://img.freepik.com/free-photo/empty-waiting-room-with-chairs-office_23-2148857793.jpg"
                            alt="Khu vực chờ"
                            className="rounded-lg shadow-md hover:shadow-lg transition-shadow h-56 w-full object-cover"
                        />
                    </div>
                </div>

                {/* Testimonials */}
                <div className="bg-blue-50 rounded-2xl p-8 shadow-sm mb-16">
                    <h2 className="text-3xl font-bold text-blue-800 mb-6 text-center">Chia Sẻ Từ Khách Hàng</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white p-6 rounded-xl shadow-md">
                            <div className="flex items-center mb-4">
                                <img
                                    src="https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop"
                                    alt="Khách hàng"
                                    className="w-16 h-16 rounded-full object-cover mr-4"
                                />
                                <div>
                                    <h4 className="font-semibold text-gray-800">Nguyễn Thị Minh</h4>
                                    <p className="text-gray-500 text-sm">Khách hàng IVF</p>
                                </div>
                            </div>
                            <p className="text-gray-600 italic">
                                "Sau 5 năm chờ đợi, cuối cùng chúng tôi đã có em bé nhờ sự hỗ trợ của Trung tâm.
                                Đội ngũ y bác sĩ không chỉ chuyên nghiệp mà còn vô cùng tâm lý, luôn đồng hành và
                                động viên chúng tôi trong suốt quá trình điều trị."
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-md">
                            <div className="flex items-center mb-4">
                                <img
                                    src="https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?q=80&w=1974&auto=format&fit=crop"
                                    alt="Khách hàng"
                                    className="w-16 h-16 rounded-full object-cover mr-4"
                                />
                                <div>
                                    <h4 className="font-semibold text-gray-800">Trần Văn Hùng & Lê Thị Hoa</h4>
                                    <p className="text-gray-500 text-sm">Điều trị vô sinh</p>
                                </div>
                            </div>
                            <p className="text-gray-600 italic">
                                "Chúng tôi đã thử nhiều nơi nhưng chỉ khi đến với Trung tâm Y tế Tinh Trùng Chill,
                                chúng tôi mới thực sự cảm thấy có hy vọng. Phương pháp điều trị cá nhân hóa và sự
                                tận tâm của các bác sĩ đã giúp chúng tôi đạt được điều tưởng chừng như không thể."
                            </p>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-blue-800 mb-6">Hãy Đồng Hành Cùng Chúng Tôi</h2>
                    <p className="text-gray-700 max-w-3xl mx-auto mb-8">
                        Chúng tôi cam kết cung cấp dịch vụ chăm sóc minh bạch, đạo đức và tập trung vào bệnh nhân.
                        Đội ngũ của chúng tôi luôn sẵn sàng hỗ trợ bạn trong suốt hành trình sinh sản, mang lại hy vọng
                        và hạnh phúc cho gia đình bạn.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default About; 