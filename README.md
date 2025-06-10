# Reflecta 🪞

**Smart Customer Service Analytics Dashboard**

Transform your vCon call data into actionable business insights with beautiful visualizations and AI-powered recommendations.

![Reflecta Dashboard](https://img.shields.io/badge/Status-TADHack%202025%20Submission-blue)
![Tech Stack](https://img.shields.io/badge/Tech-TypeScript%20|%20React%20|%20Node.js-green)

## 📋 What is Reflecta?

Reflecta is an intelligent customer service analytics platform that processes vCon (Virtual Conversation) JSON files to provide comprehensive insights into call center performance. The application analyzes customer conversations and generates detailed reports on service quality, customer satisfaction, and operational efficiency.

## ✨ Key Features

- 📞 **Individual Call Quality Scoring** - Automated 1-10 ratings for each call based on greetings, tone, resolution time, and escalations
- 📊 **Performance Analytics** - Track wait times, call volumes, and satisfaction scores with trend analysis
- 😊 **Sentiment Analysis** - Identify customer complaints and compliments with emoji-based visual indicators
- 🎯 **Service Type Analysis** - Discover most and least engaged service categories
- 📈 **Executive Dashboard** - High-level insights with actionable recommendations
- 📋 **Export Capabilities** - Generate PDF reports and CSV data exports
- 🎨 **Professional Interface** - Clean, dark-themed UI optimized for business use

## 🖥️ Demo Preview

![Reflecta Dashboard](dashboard-screenshot.png)

<!-- To add a screenshot: 
1. Take a screenshot of your Reflecta dashboard
2. In Replit, go to the 'Files' tab on the left sidebar
3. Upload your screenshot file and rename it to 'dashboard-screenshot.png'
4. Place it in the root directory (same level as README.md)
5. The image will automatically display above
-->

## 🚀 Quick Start with Sample Data

1. **Start the Application**
   ```bash
   npm install
   npm run dev
   ```

2. **Test with Sample File**
   - The project includes `sample-vcon.json` for immediate testing
   - Upload this file through the dashboard to see all features in action
   - View call quality scores, performance metrics, and insights

3. **Access Dashboard**
   - Open your browser to `http://localhost:5000`
   - Upload your vCon JSON file or use the provided sample
   - Explore the analytics dashboard with real-time insights

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **Data Processing**: Custom vCon parser with sentiment analysis
- **UI Components**: Radix UI, Lucide React icons
- **Charts**: Recharts for data visualization
- **File Handling**: Multer for secure uploads

## 📁 vCon File Format

Reflecta supports standard vCon JSON files with the following structure:
```json
{
  "vcon": "0.0.1",
  "uuid": "unique-identifier",
  "parties": [...],
  "dialog": [...],
  "analysis": [...]
}
```

## 🎯 How to Use

1. **Upload vCon File**: Drag and drop or select your vCon JSON file
2. **View Analytics**: Explore the generated dashboard with:
   - Call quality scores for individual conversations
   - Performance metrics and trends
   - Customer sentiment analysis
   - Service type breakdowns
3. **Export Reports**: Generate PDF summaries or CSV data for further analysis
4. **Get Insights**: Review AI-powered recommendations for service improvement

## 📊 Analytics Capabilities

### Call Quality Metrics
- **Greeting Quality**: Professional opening assessment
- **Tone Analysis**: Customer satisfaction indicators
- **Resolution Time**: Efficiency measurements
- **Escalation Tracking**: Issue complexity analysis

### Performance Insights
- Average wait times across all calls
- Customer satisfaction scores and trends
- Call volume patterns and peaks
- Service type popularity analysis

### Visual Indicators
- ✅ Excellent calls (9-10 rating)
- 👍 Good calls (7-8 rating)
- ⚠️ Needs improvement (5-6 rating)
- 🚩 Poor calls (1-4 rating)

## 👥 Team

**Project Creator**: Built for TADHack 2025  
**Technology Focus**: vCon data processing and customer service analytics  
**Innovation**: Real-time call quality scoring with emoji-based visual feedback

## 🏆 TADHack 2025 Submission

This project is an official submission to **TADHack 2025**, showcasing innovative use of:
- vCon (Virtual Conversation) data format
- Real-time analytics processing
- AI-powered quality assessment
- Business intelligence dashboards

**Submission Category**: Customer Service Analytics  
**Innovation Focus**: Automated call quality scoring with visual feedback systems

## 🔧 Installation & Development

```bash
# Clone the repository
git clone [repository-url]
cd reflecta

# Install dependencies
npm install

# Start development server
npm run dev

# Access application
open http://localhost:5000
```

## 📝 Usage Examples

### Basic Upload
1. Navigate to the dashboard
2. Use the sample file: `sample-vcon.json`
3. View generated analytics immediately

### Advanced Analysis
1. Upload multiple vCon files for comparison
2. Export detailed reports for stakeholder review
3. Use insights for service training programs

## 🤝 Contributing

This project was created for TADHack 2025. For questions or collaboration opportunities, please reach out through email sinczedy@gmail.com



Copyright (c) 2025 Reflecta



THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

**Built with ❤️ for TADHack 2025** | **Transforming Customer Service Through Data**
