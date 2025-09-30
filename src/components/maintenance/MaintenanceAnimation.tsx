import React from 'react';

const MaintenanceAnimation: React.FC = () => {
  return (
    <div className="w-full max-w-md mx-auto">
      <svg
        viewBox="0 0 400 300"
        className="w-full h-auto"
        aria-label="Ilustração de manutenção em andamento"
        role="img"
      >
        {/* Fundo */}
        <rect width="400" height="300" fill="#0E0F13" />
        
        {/* Estrelas de fundo */}
        <g opacity="0.3">
          <circle cx="50" cy="50" r="1" fill="#F5F7FA">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="350" cy="80" r="1.5" fill="#F5F7FA">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="4s" repeatCount="indefinite" />
          </circle>
          <circle cx="80" cy="200" r="1" fill="#F5F7FA">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="5s" repeatCount="indefinite" />
          </circle>
          <circle cx="320" cy="250" r="1.5" fill="#F5F7FA">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="3.5s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* Guindaste */}
        <g transform="translate(50, 100)">
          {/* Base do guindaste */}
          <rect x="0" y="80" width="8" height="40" fill="#AAB2C8" />
          <rect x="-10" y="115" width="28" height="5" fill="#AAB2C8" />
          
          {/* Torre do guindaste */}
          <rect x="2" y="20" width="4" height="60" fill="#4C9BFF" />
          
          {/* Braço do guindaste */}
          <g transform="rotate(-15 4 20)">
            <rect x="0" y="15" width="80" height="3" fill="#4C9BFF" />
            <rect x="75" y="10" width="3" height="20" fill="#4C9BFF" />
            
            {/* Cabo */}
            <line x1="40" y1="16" x2="40" y2="60" stroke="#AAB2C8" strokeWidth="1" />
            
            {/* Bloco sendo movido */}
            <rect x="35" y="60" width="10" height="8" fill="#FFC24B" rx="2">
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0; 0,-5; 0,0"
                dur="4s"
                repeatCount="indefinite"
              />
            </rect>
          </g>
        </g>

        {/* Engrenagens */}
        <g transform="translate(250, 80)">
          {/* Engrenagem 1 */}
          <g>
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0;360"
              dur="8s"
              repeatCount="indefinite"
            />
            <circle cx="0" cy="0" r="20" fill="#4C9BFF" opacity="0.8" />
            <circle cx="0" cy="0" r="8" fill="#0E0F13" />
            {/* Dentes da engrenagem */}
            {Array.from({ length: 8 }).map((_, i) => (
              <rect
                key={i}
                x="-2"
                y="-25"
                width="4"
                height="8"
                fill="#4C9BFF"
                transform={`rotate(${i * 45} 0 0)`}
              />
            ))}
          </g>
          
          {/* Engrenagem 2 (menor) */}
          <g transform="translate(35, 15)">
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="360;0"
              dur="6s"
              repeatCount="indefinite"
            />
            <circle cx="0" cy="0" r="12" fill="#FFC24B" opacity="0.8" />
            <circle cx="0" cy="0" r="5" fill="#0E0F13" />
            {/* Dentes da engrenagem menor */}
            {Array.from({ length: 6 }).map((_, i) => (
              <rect
                key={i}
                x="-1.5"
                y="-15"
                width="3"
                height="6"
                fill="#FFC24B"
                transform={`rotate(${i * 60} 0 0)`}
              />
            ))}
          </g>
        </g>

        {/* Cones de obra */}
        <g transform="translate(100, 200)">
          <polygon points="0,30 15,0 30,30" fill="#FFC24B" />
          <rect x="12" y="30" width="6" height="15" fill="#FFC24B" />
          <rect x="10" y="45" width="10" height="3" fill="#FFC24B" />
        </g>

        <g transform="translate(300, 180)">
          <polygon points="0,30 15,0 30,30" fill="#FFC24B" />
          <rect x="12" y="30" width="6" height="15" fill="#FFC24B" />
          <rect x="10" y="45" width="10" height="3" fill="#FFC24B" />
        </g>

        {/* Faíscas */}
        <g opacity="0.7">
          <g transform="translate(200, 120)">
            <circle r="1" fill="#FFC24B">
              <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" />
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0; 5,-5; 10,-10"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
          </g>
          
          <g transform="translate(180, 140)">
            <circle r="0.8" fill="#FFC24B">
              <animate attributeName="opacity" values="0;1;0" dur="2.5s" repeatCount="indefinite" />
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0; -3,-8; -6,-16"
                dur="2.5s"
                repeatCount="indefinite"
              />
            </circle>
          </g>
          
          <g transform="translate(220, 100)">
            <circle r="1.2" fill="#FFC24B">
              <animate attributeName="opacity" values="0;1;0" dur="3s" repeatCount="indefinite" />
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0; 4,-6; 8,-12"
                dur="3s"
                repeatCount="indefinite"
              />
            </circle>
          </g>
        </g>

        {/* Nuvem de poeira */}
        <g transform="translate(150, 250)" opacity="0.4">
          <ellipse cx="0" cy="0" rx="15" ry="8" fill="#AAB2C8">
            <animate attributeName="opacity" values="0.4;0.8;0.4" dur="4s" repeatCount="indefinite" />
            <animateTransform
              attributeName="transform"
              type="scale"
              values="1;1.2;1"
              dur="4s"
              repeatCount="indefinite"
            />
          </ellipse>
          <ellipse cx="10" cy="-5" rx="8" ry="5" fill="#AAB2C8">
            <animate attributeName="opacity" values="0.4;0.8;0.4" dur="4s" repeatCount="indefinite" />
            <animateTransform
              attributeName="transform"
              type="scale"
              values="1;1.2;1"
              dur="4s"
              repeatCount="indefinite"
            />
          </ellipse>
        </g>
      </svg>
    </div>
  );
};

export default MaintenanceAnimation;
