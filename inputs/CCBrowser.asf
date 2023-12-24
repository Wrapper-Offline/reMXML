package anifire.browser.components
{
	import anifire.browser.core.CharThumb;
	import anifire.browser.core.Theme;
	import anifire.browser.events.ProductGroupCollectionEvent;
	import anifire.browser.models.CharacterExplorerCollection;
	import anifire.browser.models.ProductGroupCollection;
	import anifire.browser.models.ThumbModel;
	import anifire.browser.skins.BusyIndicator;
	import anifire.browser.skins.CategoryDropDownListSkin;
	import anifire.browser.skins.CcBrowserTabBarSkin;
	import anifire.browser.skins.CcProductExplorerSkin;
	import anifire.browser.skins.CcProductExplorerThumbRenderer;
	import anifire.managers.AppConfigManager;
	import anifire.util.UtilDict;
	import flash.accessibility.*;
	import flash.debugger.*;
	import flash.display.*;
	import flash.errors.*;
	import flash.events.*;
	import flash.external.*;
	import flash.geom.*;
	import flash.media.*;
	import flash.net.*;
	import flash.printing.*;
	import flash.profiler.*;
	import flash.system.*;
	import flash.text.*;
	import flash.ui.*;
	import flash.utils.*;
	import flash.xml.*;
	import mx.binding.*;
	import mx.collections.IList;
	import mx.containers.ViewStack;
	import mx.core.ClassFactory;
	import mx.core.DeferredInstanceFromFunction;
	import mx.core.IFlexModuleFactory;
	import mx.core.UIComponentDescriptor;
	import mx.core.mx_internal;
	import mx.events.PropertyChangeEvent;
	import mx.filters.*;
	import mx.styles.*;
	import spark.components.DropDownList;
	import spark.components.Group;
	import spark.components.NavigatorContent;
	import spark.components.TabBar;
	import spark.components.VGroup;
	import spark.events.IndexChangeEvent;
	
	public class CcBrowser extends Group implements IBindingClient
	{
		
		private static var _configManager:AppConfigManager = AppConfigManager.instance;
		
		private static var _watcherSetupUtil:IWatcherSetupUtil2;
		 
		
		public var _CcBrowser_Group3:Group;
		
		public var _CcBrowser_NavigatorContent1:NavigatorContent;
		
		public var _CcBrowser_NavigatorContent2:NavigatorContent;
		
		public var _CcBrowser_TabBar1:TabBar;
		
		private var _688965637bodyTypeSelector:anifire.browser.components.CcBodyTypeSelector;
		
		private var _425996988categoryList:DropDownList;
		
		private var _1433796909customerCharaterExplorer:anifire.browser.components.CcProductExplorer;
		
		private var _911083019stockCharaterExplorer:anifire.browser.components.CcProductExplorer;
		
		private var _1554553085viewstack:ViewStack;
		
		private var __moduleFactoryInitialized:Boolean = false;
		
		private var _themeId:String;
		
		private var _theme:Theme;
		
		protected var _974242435_themeCharacterCollection:CharacterExplorerCollection;
		
		private var _characterCollectionLookup:Object;
		
		private var _430393044_loadingThemeCC:Boolean = true;
		
		mx_internal var _bindings:Array;
		
		mx_internal var _watchers:Array;
		
		mx_internal var _bindingsByDestination:Object;
		
		mx_internal var _bindingsBeginWithWord:Object;
		
		public function CcBrowser()
		{
			var bindings:Array;
			var watchers:Array;
			var i:uint;
			var target:Object = null;
			var watcherSetupUtilClass:Object = null;
			this._characterCollectionLookup = {};
			this.mx_internal::_bindings = [];
			this.mx_internal::_watchers = [];
			this.mx_internal::_bindingsByDestination = {};
			this.mx_internal::_bindingsBeginWithWord = {};
			super();
			mx_internal::_document = this;
			bindings = this._CcBrowser_bindingsSetup();
			watchers = [];
			target = this;
			if(_watcherSetupUtil == null)
			{
				watcherSetupUtilClass = getDefinitionByName("_anifire_browser_components_CcBrowserWatcherSetupUtil");
				watcherSetupUtilClass["init"](null);
			}
			_watcherSetupUtil.setup(this,function(param1:String):*
			{
				return target[param1];
			},function(param1:String):*
			{
				return CcBrowser[param1];
			},bindings,watchers);
			mx_internal::_bindings = mx_internal::_bindings.concat(bindings);
			mx_internal::_watchers = mx_internal::_watchers.concat(watchers);
			this.mxmlContent = [this._CcBrowser_VGroup1_c(),this._CcBrowser_DropDownList1_i()];
			i = 0;
			while(i < bindings.length)
			{
				Binding(bindings[i]).execute();
				i++;
			}
		}
		
		public static function set watcherSetupUtil(param1:IWatcherSetupUtil2) : void
		{
			CcBrowser._watcherSetupUtil = param1;
		}
		
		override public function set moduleFactory(param1:IFlexModuleFactory) : void
		{
			super.moduleFactory = param1;
			if(this.__moduleFactoryInitialized)
			{
				return;
			}
			this.__moduleFactoryInitialized = true;
		}
		
		override public function initialize() : void
		{
			super.initialize();
		}
		
		public function initUI() : void
		{
			this._themeId = _configManager.getValue("themeId");
			this.bodyTypeSelector.themeId = this._themeId;
			this.customerCharaterExplorer.themeId = this._themeId;
			this.stockCharaterExplorer.themeId = this._themeId;
			this.categoryList.visible = true;
			this.loadStockCharacters();
		}
		
		private function loadStockCharacters() : void
		{
			var _loc1_:String = this._themeId;
			switch(this._themeId)
			{
				case "family":
					_loc1_ = "custom";
					break;
				case "cc2":
					_loc1_ = "action";
			}
			this._theme = new Theme();
			this._theme.addEventListener(Event.COMPLETE,this.onLoadThemeComplete);
			this._theme.initThemeByLoadThemeFile(_loc1_);
		}
		
		private function onLoadThemeComplete(param1:Event) : void
		{
			this.onShowThemeCharacter();
		}
		
		private function onShowThemeCharacter() : void
		{
			var _loc4_:int = 0;
			var _loc5_:int = 0;
			var _loc6_:CharThumb = null;
			var _loc7_:ThumbModel = null;
			var _loc1_:Theme = this._theme;
			var _loc2_:CharacterExplorerCollection = this._characterCollectionLookup[_loc1_.id];
			var _loc3_:Boolean = _loc2_ != this._themeCharacterCollection || !_loc2_;
			this._themeCharacterCollection = _loc2_;
			if(!this._themeCharacterCollection)
			{
				this._themeCharacterCollection = new CharacterExplorerCollection(_loc1_);
				this._characterCollectionLookup[_loc1_.id] = this._themeCharacterCollection;
				_loc4_ = _loc1_.charThumbs.length;
				_loc5_ = 0;
				while(_loc5_ < _loc4_)
				{
					if((_loc6_ = _loc1_.charThumbs.getValueByIndex(_loc5_) as CharThumb).enable)
					{
						(_loc7_ = new ThumbModel(_loc6_,_loc6_.firstColorSetId)).isStoreCharacter = true;
						this._themeCharacterCollection.addProduct(_loc7_);
					}
					_loc5_++;
				}
				this._themeCharacterCollection.sortByCategoryName();
				if(Boolean(_loc1_.ccThemeId) && this._themeCharacterCollection.nextUserCharacterPage == 0)
				{
					this._themeCharacterCollection.addEventListener(ProductGroupCollectionEvent.THEME_CHAR_COMPLETE,this.onUserCCLoaded);
					this._themeCharacterCollection.loadNextPage();
					return;
				}
			}
			if(_loc3_)
			{
				this.customerCharaterExplorer.displayNaturally();
				this.stockCharaterExplorer.displayNaturally();
			}
		}
		
		private function onUserCCLoaded(param1:Event) : void
		{
			this._loadingThemeCC = false;
			this._themeCharacterCollection.removeEventListener(ProductGroupCollectionEvent.THEME_CHAR_COMPLETE,this.onUserCCLoaded);
			this.customerCharaterExplorer.displayNaturally();
			this.stockCharaterExplorer.displayNaturally();
			this.customerCharaterExplorer.selectCustomCollection();
		}
		
		private function onCategoryListChange(param1:IndexChangeEvent) : void
		{
			this.stockCharaterExplorer.selectCategoryIndex(param1.newIndex);
		}
		
		private function _CcBrowser_VGroup1_c() : VGroup
		{
			var _loc1_:VGroup = new VGroup();
			_loc1_.percentWidth = 100;
			_loc1_.percentHeight = 100;
			_loc1_.horizontalAlign = "left";
			_loc1_.mxmlContent = [this._CcBrowser_TabBar1_i(),this._CcBrowser_ViewStack1_i()];
			if(!_loc1_.document)
			{
				_loc1_.document = this;
			}
			return _loc1_;
		}
		
		private function _CcBrowser_TabBar1_i() : TabBar
		{
			var _loc1_:TabBar = new TabBar();
			_loc1_.height = 40;
			_loc1_.percentWidth = 100;
			_loc1_.setStyle("skinClass",CcBrowserTabBarSkin);
			_loc1_.id = "_CcBrowser_TabBar1";
			if(!_loc1_.document)
			{
				_loc1_.document = this;
			}
			this._CcBrowser_TabBar1 = _loc1_;
			BindingManager.executeBindings(this,"_CcBrowser_TabBar1",this._CcBrowser_TabBar1);
			return _loc1_;
		}
		
		private function _CcBrowser_ViewStack1_i() : ViewStack
		{
			var temp:ViewStack = new ViewStack();
			temp.percentWidth = 100;
			temp.percentHeight = 100;
			temp.creationPolicy = "all";
			temp.setStyle("paddingTop",10);
			temp.id = "viewstack";
			if(!temp.document)
			{
				temp.document = this;
			}
			temp.mx_internal::_documentDescriptor = new UIComponentDescriptor({
				"type":ViewStack,
				"id":"viewstack",
				"stylesFactory":function():void
				{
					this.paddingTop = 10;
				},
				"propertiesFactory":function():Object
				{
					return {"childDescriptors":[new UIComponentDescriptor({
						"type":NavigatorContent,
						"id":"_CcBrowser_NavigatorContent1",
						"propertiesFactory":function():Object
						{
							return {
								"percentWidth":100,
								"percentHeight":100,
								"mxmlContentFactory":new DeferredInstanceFromFunction(_CcBrowser_Array3_c)
							};
						}
					}),new UIComponentDescriptor({
						"type":NavigatorContent,
						"id":"_CcBrowser_NavigatorContent2",
						"propertiesFactory":function():Object
						{
							return {
								"percentWidth":100,
								"percentHeight":100,
								"mxmlContentFactory":new DeferredInstanceFromFunction(_CcBrowser_Array7_c)
							};
						}
					})]};
				}
			});
			temp.mx_internal::_documentDescriptor.document = this;
			this.viewstack = temp;
			BindingManager.executeBindings(this,"viewstack",this.viewstack);
			return temp;
		}
		
		private function _CcBrowser_Array3_c() : Array
		{
			return [this._CcBrowser_VGroup2_c()];
		}
		
		private function _CcBrowser_VGroup2_c() : VGroup
		{
			var _loc1_:VGroup = new VGroup();
			_loc1_.percentWidth = 100;
			_loc1_.percentHeight = 100;
			_loc1_.mxmlContent = [this._CcBrowser_CcBodyTypeSelector1_i(),this._CcBrowser_Group2_c()];
			if(!_loc1_.document)
			{
				_loc1_.document = this;
			}
			return _loc1_;
		}
		
		private function _CcBrowser_CcBodyTypeSelector1_i() : anifire.browser.components.CcBodyTypeSelector
		{
			var _loc1_:anifire.browser.components.CcBodyTypeSelector = new anifire.browser.components.CcBodyTypeSelector();
			_loc1_.percentWidth = 100;
			_loc1_.id = "bodyTypeSelector";
			if(!_loc1_.document)
			{
				_loc1_.document = this;
			}
			this.bodyTypeSelector = _loc1_;
			BindingManager.executeBindings(this,"bodyTypeSelector",this.bodyTypeSelector);
			return _loc1_;
		}
		
		private function _CcBrowser_Group2_c() : Group
		{
			var _loc1_:Group = new Group();
			_loc1_.percentWidth = 100;
			_loc1_.percentHeight = 100;
			_loc1_.mxmlContent = [this._CcBrowser_CcProductExplorer1_i(),this._CcBrowser_Group3_i()];
			if(!_loc1_.document)
			{
				_loc1_.document = this;
			}
			return _loc1_;
		}
		
		private function _CcBrowser_CcProductExplorer1_i() : anifire.browser.components.CcProductExplorer
		{
			var _loc1_:anifire.browser.components.CcProductExplorer = new anifire.browser.components.CcProductExplorer();
			_loc1_.percentWidth = 100;
			_loc1_.percentHeight = 100;
			_loc1_.categoryListWidth = 96;
			_loc1_.productRenderer = this._CcBrowser_ClassFactory1_c();
			_loc1_.setStyle("skinClass",CcProductExplorerSkin);
			_loc1_.id = "customerCharaterExplorer";
			if(!_loc1_.document)
			{
				_loc1_.document = this;
			}
			this.customerCharaterExplorer = _loc1_;
			BindingManager.executeBindings(this,"customerCharaterExplorer",this.customerCharaterExplorer);
			return _loc1_;
		}
		
		private function _CcBrowser_ClassFactory1_c() : ClassFactory
		{
			var _loc1_:ClassFactory = new ClassFactory();
			_loc1_.generator = CcProductExplorerThumbRenderer;
			return _loc1_;
		}
		
		private function _CcBrowser_Group3_i() : Group
		{
			var _loc1_:Group = new Group();
			_loc1_.percentWidth = 100;
			_loc1_.height = 300;
			_loc1_.mxmlContent = [this._CcBrowser_BusyIndicator1_c()];
			_loc1_.id = "_CcBrowser_Group3";
			if(!_loc1_.document)
			{
				_loc1_.document = this;
			}
			this._CcBrowser_Group3 = _loc1_;
			BindingManager.executeBindings(this,"_CcBrowser_Group3",this._CcBrowser_Group3);
			return _loc1_;
		}
		
		private function _CcBrowser_BusyIndicator1_c() : BusyIndicator
		{
			var _loc1_:BusyIndicator = new BusyIndicator();
			_loc1_.verticalCenter = 0;
			_loc1_.horizontalCenter = 0;
			_loc1_.width = 80;
			_loc1_.height = 80;
			_loc1_.setStyle("symbolColor",0);
			if(!_loc1_.document)
			{
				_loc1_.document = this;
			}
			return _loc1_;
		}
		
		private function _CcBrowser_Array7_c() : Array
		{
			return [this._CcBrowser_Group4_c()];
		}
		
		private function _CcBrowser_Group4_c() : Group
		{
			var _loc1_:Group = new Group();
			_loc1_.percentWidth = 100;
			_loc1_.percentHeight = 100;
			_loc1_.mxmlContent = [this._CcBrowser_CcProductExplorer2_i()];
			if(!_loc1_.document)
			{
				_loc1_.document = this;
			}
			return _loc1_;
		}
		
		private function _CcBrowser_CcProductExplorer2_i() : anifire.browser.components.CcProductExplorer
		{
			var _loc1_:anifire.browser.components.CcProductExplorer = new anifire.browser.components.CcProductExplorer();
			_loc1_.percentWidth = 100;
			_loc1_.percentHeight = 100;
			_loc1_.categoryListWidth = 96;
			_loc1_.productRenderer = this._CcBrowser_ClassFactory2_c();
			_loc1_.setStyle("skinClass",CcProductExplorerSkin);
			_loc1_.id = "stockCharaterExplorer";
			if(!_loc1_.document)
			{
				_loc1_.document = this;
			}
			this.stockCharaterExplorer = _loc1_;
			BindingManager.executeBindings(this,"stockCharaterExplorer",this.stockCharaterExplorer);
			return _loc1_;
		}
		
		private function _CcBrowser_ClassFactory2_c() : ClassFactory
		{
			var _loc1_:ClassFactory = new ClassFactory();
			_loc1_.generator = CcProductExplorerThumbRenderer;
			return _loc1_;
		}
		
		private function _CcBrowser_DropDownList1_i() : DropDownList
		{
			var _loc1_:DropDownList = new DropDownList();
			_loc1_.left = 350;
			_loc1_.top = 15;
			_loc1_.setStyle("skinClass",CategoryDropDownListSkin);
			_loc1_.addEventListener("change",this.__categoryList_change);
			_loc1_.id = "categoryList";
			if(!_loc1_.document)
			{
				_loc1_.document = this;
			}
			this.categoryList = _loc1_;
			BindingManager.executeBindings(this,"categoryList",this.categoryList);
			return _loc1_;
		}
		
		public function __categoryList_change(param1:IndexChangeEvent) : void
		{
			this.onCategoryListChange(param1);
		}
		
		private function _CcBrowser_bindingsSetup() : Array
		{
			var result:Array = [];
			result[0] = new Binding(this,null,null,"_CcBrowser_TabBar1.dataProvider","viewstack");
			result[1] = new Binding(this,function():String
			{
				var _loc1_:* = UtilDict.toDisplay("go","Custom Characters");
				return _loc1_ == undefined ? null : String(_loc1_);
			},null,"_CcBrowser_NavigatorContent1.label");
			result[2] = new Binding(this,function():Boolean
			{
				return !_loadingThemeCC;
			},null,"customerCharaterExplorer.visible");
			result[3] = new Binding(this,function():ProductGroupCollection
			{
				return _themeCharacterCollection;
			},null,"customerCharaterExplorer.productProvider");
			result[4] = new Binding(this,function():Boolean
			{
				return _loadingThemeCC;
			},null,"_CcBrowser_Group3.visible");
			result[5] = new Binding(this,function():String
			{
				var _loc1_:* = UtilDict.toDisplay("go","Stock Characters");
				return _loc1_ == undefined ? null : String(_loc1_);
			},null,"_CcBrowser_NavigatorContent2.label");
			result[6] = new Binding(this,function():ProductGroupCollection
			{
				return _themeCharacterCollection;
			},null,"stockCharaterExplorer.productProvider");
			result[7] = new Binding(this,function():IList
			{
				return _themeCharacterCollection;
			},null,"categoryList.dataProvider");
			return result;
		}
		
		[Bindable(event="propertyChange")]
		public function get bodyTypeSelector() : anifire.browser.components.CcBodyTypeSelector
		{
			return this._688965637bodyTypeSelector;
		}
		
		public function set bodyTypeSelector(param1:anifire.browser.components.CcBodyTypeSelector) : void
		{
			var _loc2_:Object = this._688965637bodyTypeSelector;
			if(_loc2_ !== param1)
			{
				this._688965637bodyTypeSelector = param1;
				if(this.hasEventListener("propertyChange"))
				{
					this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this,"bodyTypeSelector",_loc2_,param1));
				}
			}
		}
		
		[Bindable(event="propertyChange")]
		public function get categoryList() : DropDownList
		{
			return this._425996988categoryList;
		}
		
		public function set categoryList(param1:DropDownList) : void
		{
			var _loc2_:Object = this._425996988categoryList;
			if(_loc2_ !== param1)
			{
				this._425996988categoryList = param1;
				if(this.hasEventListener("propertyChange"))
				{
					this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this,"categoryList",_loc2_,param1));
				}
			}
		}
		
		[Bindable(event="propertyChange")]
		public function get customerCharaterExplorer() : anifire.browser.components.CcProductExplorer
		{
			return this._1433796909customerCharaterExplorer;
		}
		
		public function set customerCharaterExplorer(param1:anifire.browser.components.CcProductExplorer) : void
		{
			var _loc2_:Object = this._1433796909customerCharaterExplorer;
			if(_loc2_ !== param1)
			{
				this._1433796909customerCharaterExplorer = param1;
				if(this.hasEventListener("propertyChange"))
				{
					this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this,"customerCharaterExplorer",_loc2_,param1));
				}
			}
		}
		
		[Bindable(event="propertyChange")]
		public function get stockCharaterExplorer() : anifire.browser.components.CcProductExplorer
		{
			return this._911083019stockCharaterExplorer;
		}
		
		public function set stockCharaterExplorer(param1:anifire.browser.components.CcProductExplorer) : void
		{
			var _loc2_:Object = this._911083019stockCharaterExplorer;
			if(_loc2_ !== param1)
			{
				this._911083019stockCharaterExplorer = param1;
				if(this.hasEventListener("propertyChange"))
				{
					this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this,"stockCharaterExplorer",_loc2_,param1));
				}
			}
		}
		
		[Bindable(event="propertyChange")]
		public function get viewstack() : ViewStack
		{
			return this._1554553085viewstack;
		}
		
		public function set viewstack(param1:ViewStack) : void
		{
			var _loc2_:Object = this._1554553085viewstack;
			if(_loc2_ !== param1)
			{
				this._1554553085viewstack = param1;
				if(this.hasEventListener("propertyChange"))
				{
					this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this,"viewstack",_loc2_,param1));
				}
			}
		}
		
		[Bindable(event="propertyChange")]
		protected function get _themeCharacterCollection() : CharacterExplorerCollection
		{
			return this._974242435_themeCharacterCollection;
		}
		
		protected function set _themeCharacterCollection(param1:CharacterExplorerCollection) : void
		{
			var _loc2_:Object = this._974242435_themeCharacterCollection;
			if(_loc2_ !== param1)
			{
				this._974242435_themeCharacterCollection = param1;
				if(this.hasEventListener("propertyChange"))
				{
					this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this,"_themeCharacterCollection",_loc2_,param1));
				}
			}
		}
		
		[Bindable(event="propertyChange")]
		private function get _loadingThemeCC() : Boolean
		{
			return this._430393044_loadingThemeCC;
		}
		
		private function set _loadingThemeCC(param1:Boolean) : void
		{
			var _loc2_:Object = this._430393044_loadingThemeCC;
			if(_loc2_ !== param1)
			{
				this._430393044_loadingThemeCC = param1;
				if(this.hasEventListener("propertyChange"))
				{
					this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this,"_loadingThemeCC",_loc2_,param1));
				}
			}
		}
	}
}
