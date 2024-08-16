import React, { useEffect, useRef, useState } from 'react';

const KAKAO_MAP_APP_KEY = 'd2a1da46b234959daf8cd1cb07af9452';

export const KakaoMapComponent: React.FC = () => {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const [address, setAddress] = useState('서울시 강남구 논현로 552');

    useEffect(() => {
        const script = document.createElement('script');
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_APP_KEY}&libraries=services`;
        script.async = true;
        script.onload = () => {
            if (window.kakao && mapContainerRef.current) {
                initializeMap();  
            }
        };
        document.body.appendChild(script);

        return () => {
            const existingScript = document.querySelector(`script[src="${script.src}"]`);
            if (existingScript) {
                document.body.removeChild(existingScript);
            }
        };
    }, []);

    useEffect(() => {
        if (window.kakao && mapContainerRef.current) {
            initializeMap();  
        }
    }, [address]);  // 주소가 변경될 때마다 지도 업데이트

    const initializeMap = () => {
        const { kakao } = window;
        const mapContainer = mapContainerRef.current;
        const mapOption = {
            center: new kakao.maps.LatLng(33.450701, 126.570667),
            level: 3
        };
        const map = new kakao.maps.Map(mapContainer, mapOption);
        const geocoder = new kakao.maps.services.Geocoder();

        geocoder.addressSearch(address, function (result: {y: any; x: any; }[], status: any) {
            if (status === kakao.maps.services.Status.OK) {
                const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
                const marker = new kakao.maps.Marker({
                    map: map,
                    position: coords
                });
                const infowindow = new kakao.maps.InfoWindow({
                    content: '<div style="width:150px;text-align:center;padding:6px 0;">우리회사</div>'
                });
                infowindow.open(map, marker);
                map.setCenter(coords);
            } else {
                console.error("주소를 찾을 수 없습니다.");
            }
        });
    };

    return (
        <div>
            <input 
                type="text" 
                value={address} 
                onChange={(e) => setAddress(e.target.value)} 
                placeholder="주소를 입력하세요" 
            />
            <div ref={mapContainerRef} style={{ width: '100%', height: '350px', border: '1px solid black' }}></div>
        </div>
    );
};

export default KakaoMapComponent;
