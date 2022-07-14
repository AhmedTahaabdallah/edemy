import { Card, Badge } from "antd";
import Link from "next/link";
import { currencyFormatter } from "../../utils";

const { Meta } = Card;

const CourseCard = ({ course }) => {
    const { title, instructor, price, image, slug, paid, category } = course;
    const href = `/course/${slug}`;
    return <Card 
            className="mb-4 ms-2 me-2"
            cover={
                <Link href={href}>
                    <a >
                        <img
                            src={image.Location}
                            alt={title}
                            style={{ 
                                height: '200px', 
                                width: '100%',
                                objectFit: 'cover', 
                                borderRadius: '2px 2px 0 0 !important' 
                            }}
                            //className='p-1'
                        />
                    </a>
                </Link>
            }
            >
                <Link href={href}>
                    <a >
                        <h2 className="font-weight-bold">{title}</h2>
                        <p>by {instructor.name}</p>
                        <Badge
                        count={category}
                        style={{ backgroundColor: '#03a9f4'}}
                        className='pb-2 me-2'
                        />
                        <h4 className="pt-2">
                            {paid ? currencyFormatter({
                                amount: price,
                                currency: 'usd'
                            }) : 'Free'}
                        </h4>
                    </a>
                </Link>
                
            </Card>;
};

export default CourseCard;