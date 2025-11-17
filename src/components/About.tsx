import { Users, GraduationCap, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import tianPhoto from './assets/team/tian.jpeg';
import deaPhoto from './assets/team/dea.jpeg';
import dindaPhoto from './assets/team/dinda.jpeg';
import izzahPhoto from './assets/team/izzah.jpeg';
import auliaPhoto from './assets/team/aulia.jpeg';

const teamMembers = [
  {
    name: 'Septian Aditya Wardana',
    nrp: '3323600001',
    email: 'septianaditya363@gmail.com',
    photo: tianPhoto,
  },
  {
    name: 'Dea Kayla Putri Darusman',
    nrp: '3323600005',
    email: 'dea.kayla10@gmail.com',
    photo: deaPhoto,
  },
  {
    name: 'Dinda Ayu Permatasari',
    nrp: '3323600012',
    email: 'dindapermatasari020@gmail.com',
    photo: dindaPhoto,
  },
  {
    name: 'Izzah Karimah',
    nrp: '3323600013',
    email: 'izzakarimah29@gmail.com',
    photo: izzahPhoto,
  },
  {
    name: 'Aulia Latifa Kristiono',
    nrp: '3323600030',
    email: 'aulialfk@gmail.com',
    photo: auliaPhoto,
  },
];

export function About() {
  return (
    <div className="p-8 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 mb-2">
          Tentang Tim
        </h1>
        <p className="text-gray-600">Perkenalkan tim di balik analisis sosial media ini</p>
      </div>

      {/* Project Info */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-purple-500" />
            Tentang Proyek
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Pertalite Social Media Analytics</h3>
              <p className="text-gray-600 leading-relaxed">
                Platform analisis komprehensif untuk menganalisis sentimen, topik, dan emoji dari komentar TikTok 
                terkait Pertalite. Proyek ini menggunakan teknik Natural Language Processing (NLP) dan Machine Learning 
                untuk memberikan insights mendalam tentang persepsi publik terhadap Pertalite di media sosial.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50">
                <p className="text-sm text-gray-600 mb-1">Dataset</p>
                <p className="text-lg font-semibold text-gray-900">1,769 Komentar</p>
                <p className="text-xs text-purple-600 mt-1">TikTok Data</p>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-pink-50 to-orange-50">
                <p className="text-sm text-gray-600 mb-1">Total Engagement</p>
                <p className="text-lg font-semibold text-gray-900">76,290 Likes</p>
                <p className="text-xs text-pink-600 mt-1">Community Interaction</p>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-orange-50 to-yellow-50">
                <p className="text-sm text-gray-600 mb-1">Analysis Period</p>
                <p className="text-lg font-semibold text-gray-900">31 Okt - 9 Nov</p>
                <p className="text-xs text-orange-600 mt-1">2025</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team Members */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-pink-500" />
            Anggota Tim
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* First row - 3 members */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {teamMembers.slice(0, 3).map((member, index) => (
              <div 
                key={index}
                className="p-4 rounded-xl bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 hover:shadow-lg transition-all border border-purple-100"
              >
                <div className="flex flex-col items-center text-center">
                  {/* Avatar Image */}
                  <div className="w-4 h-14 rounded-full overflow-hidden mb-3 bg-gradient-to-br from-purple-200 to-pink-200 shadow-md" style={{ aspectRatio: '1/1' }}>
                    <img 
                      src={member.photo}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      style={{ objectFit: 'cover', objectPosition: 'center' }}
                    />
                  </div>
                  
                  {/* Member Info */}
                  <h3 className="font-semibold text-gray-900 mb-1 text-sm">{member.name}</h3>
                  <p className="text-xs font-medium text-purple-600 mb-2">NRP: {member.nrp}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <Mail className="w-3 h-3" />
                    <a 
                      href={`mailto:${member.email}`}
                      className="hover:text-purple-600 transition-colors break-all"
                    >
                      {member.email}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Second row - 2 members centered */}
          <div className="flex justify-center gap-4">
            {teamMembers.slice(3, 5).map((member, index) => (
              <div 
                key={index + 3}
                className="p-4 rounded-xl bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 hover:shadow-lg transition-all border border-purple-100 w-full md:w-1/3"
              >
                <div className="flex flex-col items-center text-center">
                  {/* Avatar Image */}
                  <div className="w-6 h-6 rounded-full overflow-hidden mb-3 bg-gradient-to-br from-purple-200 to-pink-200 shadow-md" style={{ aspectRatio: '1/1' }}>
                    <img 
                      src={member.photo}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      style={{ objectFit: 'cover', objectPosition: 'center' }}
                    />
                  </div>
                  
                  {/* Member Info */}
                  <h3 className="font-semibold text-gray-900 mb-1 text-sm">{member.name}</h3>
                  <p className="text-xs font-medium text-purple-600 mb-2">NRP: {member.nrp}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <Mail className="w-3 h-3" />
                    <a 
                      href={`mailto:${member.email}`}
                      className="hover:text-purple-600 transition-colors break-all"
                    >
                      {member.email}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Technologies */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm mt-8">
        <CardHeader>
          <CardTitle>Technologies Used</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {['Python', 'Pandas', 'NumPy', 'Scikit-learn', 'NLTK', 'React', 'TypeScript', 'Tailwind CSS', 'Recharts', 'TikTok API'].map((tech, index) => (
              <span 
                key={index}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-sm font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}