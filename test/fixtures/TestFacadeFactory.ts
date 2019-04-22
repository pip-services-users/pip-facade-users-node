import { Factory } from 'pip-services3-components-node';
import { Descriptor } from 'pip-services3-commons-node';

import { TestFacadeService } from './TestFacadeService';

export class TestFacadeFactory extends Factory {
	public static Descriptor = new Descriptor("pip-services-facade", "factory", "default", "default", "1.0");

	public static TestServiceDescriptor = new Descriptor("pip-services-facade", "service", "test", "*", "1.0");
	
	public constructor() {
		super();

		this.registerAsType(TestFacadeFactory.TestServiceDescriptor, TestFacadeService);
	}
	
}
