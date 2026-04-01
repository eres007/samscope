const fs = require('fs');
let c = fs.readFileSync('G:/project/samscope website/service.html', 'utf8');

// Swap Card 2 (Social Media Content Dev) with Card 3 (Social Media Advertising)
const card2 = `                <!-- Card 2 -->
                <div class="service-card">
                    <h3 class="service-title">STRATEGIC SOCIAL <br> MEDIA CONTENT DEVELOPMENT</h3>
                    <p class="service-text">
                        We create strategic content frameworks that drive engagement, build community, and align with
                        your brand voice. Our content development process includes research-driven planning,
                        audience-focused messaging, and content calendar management to ensure consistency and relevance
                        across all social platforms.
                    </p>
                    <a href="contact.html" class="btn-service">Book Free Consultation</a>
                </div>`;

const card3 = `                <!-- Card 3 -->
                <div class="service-card">
                    <h3 class="service-title">STRATEGIC SOCIAL <br> MEDIA ADVERTISING</h3>
                    <p class="service-text">
                        We develop data-driven advertising systems designed to maximize ROI and scalability. Our
                        strategy includes audience segmentation, funnel-based campaign structure, creative optimization,
                        and continuous performance analysis. We focus on sustainable customer acquisition while
                        maintaining cost efficiency and measurable returns.
                    </p>
                    <a href="contact.html" class="btn-service">Book Free Consultation</a>
                </div>`;

const newCard2 = card3.replace('<!-- Card 3 -->', '<!-- Card 2 -->');
const newCard3 = card2.replace('<!-- Card 2 -->', '<!-- Card 3 -->');

c = c.replace(card2, '%%PLACEHOLDER%%');
c = c.replace(card3, newCard3);
c = c.replace('%%PLACEHOLDER%%', newCard2);

fs.writeFileSync('G:/project/samscope website/service.html', c, 'utf8');
console.log('Cards swapped!');

